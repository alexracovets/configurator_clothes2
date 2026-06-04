import type { PrintLayerContext } from '../types';

import { useStepLogoSelection } from '@store';
import { PRINT_ATLAS_WIDTH } from '../constants';
import { drawLogoOnAtlas } from '../utils/drawLogoOnAtlas';
import { drawGizmoFrame, drawGizmoHandle } from '../utils/gizmoLayout';
import { buildLogoGizmoLayout, LOGO_GIZMO_HANDLES } from '../utils/logoGizmoLayout';
import { getCachedNaturalSize } from '../utils/logoNaturalSize';

const applyLogoLayer = async ({ ctx, input }: PrintLayerContext) => {
  const userLogos = input.logoParts.filter((part) => part.visible && !part.isDefault);
  if (userLogos.length === 0) return;

  const selectedPartId = useStepLogoSelection.getState().selectedPartId;

  for (const part of userLogos) {
    await drawLogoOnAtlas(ctx, part, ctx.canvas.width, ctx.canvas.height);

    if (part.id === selectedPartId) {
      const natural = getCachedNaturalSize(part.src);
      if (!natural) continue;
      const layout = buildLogoGizmoLayout(part, natural);
      drawGizmoFrame(ctx, layout.textBox, PRINT_ATLAS_WIDTH, part.rotation);
      for (const handle of LOGO_GIZMO_HANDLES) {
        drawGizmoHandle(ctx, layout.handles[handle], handle, PRINT_ATLAS_WIDTH);
      }
    }
  }
};

export { applyLogoLayer };
