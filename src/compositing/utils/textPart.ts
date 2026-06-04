/** Minimal shared shape consumed by the text drawing + gizmo utils.
 * Both StepNamePartState and StepNumberPartState are structurally assignable. */
interface TextPartLike {
  id: string;
  positionKey: string;
  uv: { x: number; y: number };
  rotation: number;
  text: string;
  font: string;
  fontSize: number;
  textColor: string;
  strokeColor: string;
  strokeWidth: number;
}

export type { TextPartLike };
