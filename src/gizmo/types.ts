type GizmoHandleKind = 'duplicate' | 'delete' | 'rotate' | 'scale';

interface PrintGizmoElement {
  id: string;
  partId: string;
  meshNames: string[];
  uv: { x: number; y: number };
  rotation: number;
  scale: number;
  /** Half-size of the text box at reference font size; multiply by scale for atlas-px hit tests. */
  half: { x: number; y: number };
  fontSize: number;
  fontSizeMin: number;
  fontSizeMax: number;
}

export type { GizmoHandleKind, PrintGizmoElement };
