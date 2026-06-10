import type { LogoPositionConfig, UvPoint } from '../entities/garment';

import type { MappedGizmoFlags } from './textPrint';

type LogoPosition = {
  key: string;
  partId: string;
  isDefault: boolean;
} & Pick<LogoPositionConfig, 'label' | 'uv' | 'rotation' | 'scale' | 'src'> &
  MappedGizmoFlags;

type LogoInstance = {
  id: string;
  positionKey: string;
  src: string;
  fileName: string;
  naturalWidth: number;
  naturalHeight: number;
  /** Baked upload orientation correction; does not affect gizmo rotation. */
  uploadRotation: number;
  opacity: number;
} & Pick<LogoPosition, 'label' | 'partId' | 'uv' | 'rotation' | 'scale' | 'isDefault' | 'showFrame' | 'showGizmo'>;

type LogoPreview = {
  instanceId: string;
  patch: Partial<Pick<LogoInstance, 'scale' | 'rotation' | 'uv'>>;
};

type StepLogoUv = UvPoint;

type StepLogoPartState = Pick<LogoInstance, 'id' | 'positionKey' | 'label' | 'uv' | 'rotation' | 'opacity' | 'scale' | 'src' | 'fileName' | 'isDefault'> & {
  baseScale: number;
  visible: boolean;
};

type StepLogoPositionState = Pick<LogoPosition, 'key' | 'label' | 'uv' | 'rotation' | 'scale' | 'interactive'> & {
  default: boolean;
  defaultSrc: string;
};

interface StepLogoStoreView {
  parts: StepLogoPartState[];
  positions: StepLogoPositionState[];
  canAddUserLogo: () => boolean;
  removePart: (id: string) => void;
  updatePart: (id: string, patch: Partial<StepLogoPartState>) => void;
}

export type { LogoInstance, LogoPosition, LogoPreview, StepLogoPartState, StepLogoPositionState, StepLogoStoreView, StepLogoUv };
