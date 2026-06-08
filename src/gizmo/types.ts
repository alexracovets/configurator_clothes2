type GizmoHandleKind = 'duplicate' | 'delete' | 'rotate' | 'scale';

interface PrintGizmoElement {
  id: string;
  partId: string;
  meshNames: string[];
  uv: { x: number; y: number };
  rotation: number;
  scale: number;
  /** Half-size of the text box, in reference-font pixels (matches the shader frame). */
  half: { x: number; y: number };
  fontSize: number;
  fontSizeMin: number;
  fontSizeMax: number;
}

export type { GizmoHandleKind, PrintGizmoElement };
