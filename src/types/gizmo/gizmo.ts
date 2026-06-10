import type { UvPoint } from '../entities/garment';

type GizmoHandleKind = 'duplicate' | 'delete' | 'rotate' | 'scale';
type PrintGizmoElementKind = 'name' | 'logo';

interface PrintGizmoElement {
  kind: PrintGizmoElementKind;
  id: string;
  partId: string;
  slotIndex: number;
  meshNames: string[];
  uv: UvPoint;
  rotation: number;
  /** Part print rotation in degrees (from product data). */
  partRotation: number;
  scale: number;
  /** Half-size of the text box at reference font size; multiply by scale for atlas-px hit tests. */
  half: { x: number; y: number };
  fontSize?: number;
  fontSizeMin?: number;
  fontSizeMax?: number;
  scaleMin?: number;
  scaleMax?: number;
}

export type { GizmoHandleKind, PrintGizmoElement, PrintGizmoElementKind };
