'use client';

import { useEffect, useMemo, useRef } from 'react';

import { useThree } from '@react-three/fiber';
import { PART_TEXTURE_SIZE } from '@constants';
import { resolvePbrTexturePaths, useConfiguratorProduct, useGarmentPbrMaps } from '@hooks';
import { useGarmentColorPreview, useGarmentShadingPreview, useStepColor, useStepShading } from '@store';
import type { Object3D } from 'three';

import { applyGarmentShading } from '../apply/applyGarmentShading';
import { applyPartColorPreview, clearAllColorPreviews } from '../apply/applyPartColorPreview';
import { applyPbrToGarment } from '../apply/applyPbrToGarment';
import { syncFabricPipeline } from '../apply/syncFabricPipeline';
import { syncPrintPipeline } from '../apply/syncPrintPipeline';
import { useFabricCompositingInput, usePrintCompositingInput } from '../resolveCompositingInput';
import { buildFabricCacheKey, buildPrintAtlasCacheKey } from '../utils/cacheKeys';

const useGarmentLayers = (root: Object3D | null) => {
  const fabric = useFabricCompositingInput();
  const print = usePrintCompositingInput();
  const colorParts = useStepColor((state) => state.parts);
  const shadingParts = useStepShading((state) => state.parts);
  const colorPreview = useGarmentColorPreview((state) => state.preview);
  const shadingPreview = useGarmentShadingPreview((state) => state.preview);
  const { product } = useConfiguratorProduct();
  const pbrPaths = useMemo(() => (product ? resolvePbrTexturePaths(product) : null), [product]);
  const pbrMaps = useGarmentPbrMaps(
    pbrPaths ?? {
      bakeNormal: '/models/crewneck/crewneck/bake_normal.jpg',
      bakeAoRoughness: '/models/crewneck/crewneck/bake_ao-bake_roughness.jpg',
      fabricNormal: '/models/crewneck/crewneck/cotton_jersey_nor_gl.jpg',
      fabricRoughness: '/models/crewneck/crewneck/cotton_jersey_rough.jpg',
    },
  );
  const invalidate = useThree((state) => state.invalidate);

  const printKey = useMemo(() => buildPrintAtlasCacheKey(print), [print]);

  const fabricSnapshot = useMemo(
    () => fabric.colorParts.map((part) => ({ id: part.id, key: buildFabricCacheKey(fabric, part.id, PART_TEXTURE_SIZE) })),
    [fabric],
  );

  const fabricRef = useRef(fabric);
  const printRef = useRef(print);

  useEffect(() => {
    fabricRef.current = fabric;
    printRef.current = print;
  });

  const prevFabricKeysRef = useRef<Record<string, string>>({});
  const pbrAppliedRef = useRef(false);
  const requestIdRef = useRef(0);

  // Pipeline 3 — once per model
  useEffect(() => {
    if (!root || !pbrMaps) return;
    if (pbrAppliedRef.current) return;

    applyPbrToGarment(root, pbrMaps, colorParts);
    pbrAppliedRef.current = true;
    invalidate();
  }, [colorParts, invalidate, pbrMaps, root]);

  useEffect(() => {
    if (!root) pbrAppliedRef.current = false;
  }, [root]);

  // Instant COLOR preview — GPU tint only
  useEffect(() => {
    if (!root || colorParts.length === 0) return;

    if (!colorPreview) {
      clearAllColorPreviews(root);
      invalidate();
      return;
    }

    applyPartColorPreview(root, colorParts, colorPreview.partId, colorPreview.color);
    invalidate();
  }, [colorParts, colorPreview, invalidate, root]);

  // SFUMATURA — GPU gradient uniforms (Colore 2, sliders) without canvas recomposite
  useEffect(() => {
    if (!root || colorParts.length === 0) return;

    applyGarmentShading(root, colorParts, shadingParts, shadingPreview);
    invalidate();
  }, [colorParts, invalidate, root, shadingParts, shadingPreview]);

  // Pipeline 4–7 — print / design only
  useEffect(() => {
    if (!root || fabric.colorParts.length === 0 || !pbrMaps) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    void syncPrintPipeline(root, fabricRef.current, printRef.current, pbrMaps).then(() => {
      if (requestIdRef.current !== requestId) return;
      invalidate();
    });
  }, [fabric.colorParts.length, invalidate, pbrMaps, printKey, root]);

  // Pipeline 1 — base color only (gradient is GPU)
  useEffect(() => {
    if (!root || fabric.colorParts.length === 0 || !pbrMaps) return;

    const prev = prevFabricKeysRef.current;
    const changedPartIds: string[] = [];

    for (const { id, key } of fabricSnapshot) {
      if (prev[id] !== key) changedPartIds.push(id);
    }

    if (changedPartIds.length === 0) return;

    prevFabricKeysRef.current = Object.fromEntries(fabricSnapshot.map((entry) => [entry.id, entry.key]));

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    void syncFabricPipeline(root, fabricRef.current, printRef.current, pbrMaps, changedPartIds).then(() => {
      if (requestIdRef.current !== requestId) return;
      applyGarmentShading(root, colorParts, shadingParts, shadingPreview);
      invalidate();
    });
  }, [colorParts, fabric.colorParts.length, fabricSnapshot, invalidate, pbrMaps, root, shadingParts, shadingPreview]);
};

export { useGarmentLayers };
