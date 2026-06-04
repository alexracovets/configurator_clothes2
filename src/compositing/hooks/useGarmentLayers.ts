'use client';

import { useEffect, useMemo, useRef } from 'react';

import { useThree } from '@react-three/fiber';
import { PART_TEXTURE_SIZE } from '@constants';
import { resolvePbrTexturePaths, useConfiguratorProduct, useGarmentPbrMaps } from '@hooks';
import {
  useGarmentColorPreview,
  useGarmentDesignPreview,
  useGarmentLogoPreview,
  useGarmentNamePreview,
  useGarmentNumberPreview,
  useStepColor,
  useStepLogoSelection,
} from '@store';
import type { Object3D } from 'three';

import { applyDesignPreview, clearDesignColorPreview } from '../apply/applyDesignColorPreview';
import { applyLogoPreview, clearLogoPreview } from '../apply/applyLogoPreview';
import { applyNamePreview, clearNamePreview } from '../apply/applyNamePreview';
import { applyNumberPreview, clearNumberPreview } from '../apply/applyNumberPreview';
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
  const colorPreview = useGarmentColorPreview((state) => state.preview);
  const designPreview = useGarmentDesignPreview((state) => state.preview);
  const opacityPreview = useGarmentDesignPreview((state) => state.opacityPreview);
  const namePreview = useGarmentNamePreview((state) => state.preview);
  const numberPreview = useGarmentNumberPreview((state) => state.preview);
  const logoPreview = useGarmentLogoPreview((state) => state.preview);
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
  const selectedLogoId = useStepLogoSelection((state) => state.selectedPartId);

  // selectedLogoId participates so the print atlas rebuilds (and draws/clears the gizmo frame)
  // when the logo selection changes — buildPrintAtlasCacheKey bakes it in.
  const printKey = useMemo(() => buildPrintAtlasCacheKey(print, selectedLogoId), [print, selectedLogoId]);

  const fabricSnapshot = useMemo(
    () => fabric.colorParts.map((part) => ({ id: part.id, key: buildFabricCacheKey(fabric, part.id, PART_TEXTURE_SIZE) })),
    [fabric],
  );

  const fabricRef = useRef(fabric);
  const printRef = useRef(print);
  const designPreviewRequestIdRef = useRef(0);

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

  // SFUMATURA — gradient is now baked into the fabric canvas (applyGradientLayer in pipeline)
  // GPU gradient removed; fabric pipeline re-runs when shadingParts change via fabricSnapshot cache key

  // DESIGN preview — rebuild print atlas with color/opacity override, no cache write
  useEffect(() => {
    if (!root) return;

    if (!designPreview && opacityPreview === null) {
      clearDesignColorPreview(root);
      invalidate();
      return;
    }

    const requestId = designPreviewRequestIdRef.current + 1;
    designPreviewRequestIdRef.current = requestId;

    void applyDesignPreview(root, fabricRef.current, printRef.current, {
      colorPreview: designPreview ?? undefined,
      opacityPreview: opacityPreview ?? undefined,
    }).then(() => {
      if (designPreviewRequestIdRef.current !== requestId) return;
      invalidate();
    });
  }, [designPreview, opacityPreview, invalidate, root]);

  const namePreviewRafRef = useRef<number | null>(null);

  // NAME preview — throttled via rAF so rapid drag events collapse into one redraw per frame
  useEffect(() => {
    if (!root) return;

    if (namePreviewRafRef.current !== null) {
      cancelAnimationFrame(namePreviewRafRef.current);
      namePreviewRafRef.current = null;
    }

    if (!namePreview) {
      clearNamePreview(root, fabricRef.current);
      invalidate();
      return;
    }

    const capturedPreview = namePreview;
    namePreviewRafRef.current = requestAnimationFrame(() => {
      namePreviewRafRef.current = null;
      applyNamePreview(root, fabricRef.current, capturedPreview.partId, capturedPreview.patch);
      invalidate();
    });

    return () => {
      if (namePreviewRafRef.current !== null) {
        cancelAnimationFrame(namePreviewRafRef.current);
        namePreviewRafRef.current = null;
      }
    };
  }, [namePreview, invalidate, root]);

  const numberPreviewRafRef = useRef<number | null>(null);

  // NUMBER preview — throttled via rAF so rapid drag events collapse into one redraw per frame
  useEffect(() => {
    if (!root) return;

    if (numberPreviewRafRef.current !== null) {
      cancelAnimationFrame(numberPreviewRafRef.current);
      numberPreviewRafRef.current = null;
    }

    if (!numberPreview) {
      clearNumberPreview(root, fabricRef.current);
      invalidate();
      return;
    }

    const capturedPreview = numberPreview;
    numberPreviewRafRef.current = requestAnimationFrame(() => {
      numberPreviewRafRef.current = null;
      applyNumberPreview(root, fabricRef.current, capturedPreview.partId, capturedPreview.patch);
      invalidate();
    });

    return () => {
      if (numberPreviewRafRef.current !== null) {
        cancelAnimationFrame(numberPreviewRafRef.current);
        numberPreviewRafRef.current = null;
      }
    };
  }, [numberPreview, invalidate, root]);

  const logoPreviewRafRef = useRef<number | null>(null);

  // LOGO preview — throttled via rAF; rebuilds the print atlas with the dragged logo patched
  useEffect(() => {
    if (!root) return;

    if (logoPreviewRafRef.current !== null) {
      cancelAnimationFrame(logoPreviewRafRef.current);
      logoPreviewRafRef.current = null;
    }

    if (!logoPreview) {
      clearLogoPreview(root);
      invalidate();
      return;
    }

    const capturedPreview = logoPreview;
    logoPreviewRafRef.current = requestAnimationFrame(() => {
      logoPreviewRafRef.current = null;
      void applyLogoPreview(root, fabricRef.current, printRef.current, capturedPreview.partId, capturedPreview.patch).then(() => invalidate());
    });

    return () => {
      if (logoPreviewRafRef.current !== null) {
        cancelAnimationFrame(logoPreviewRafRef.current);
        logoPreviewRafRef.current = null;
      }
    };
  }, [logoPreview, invalidate, root]);

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
      invalidate();
    });
  }, [colorParts, fabric.colorParts.length, fabricSnapshot, invalidate, pbrMaps, root]);
};

export { useGarmentLayers };
