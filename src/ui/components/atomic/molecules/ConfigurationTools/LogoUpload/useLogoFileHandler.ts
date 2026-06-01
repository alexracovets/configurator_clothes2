'use client';

import { useCallback, useState } from 'react';

import { LogoFileError, logoFileToDisplayUrl, preloadLogoDisplayUrl, yieldToMain } from '@utils';
import { useStepLogo } from '@store';
import type { StepLogoPositionState } from '@store';

const useLogoFileHandler = () => {
  const assignLogoToPosition = useStepLogo((state) => state.assignLogoToPosition);
  const addUserLogo = useStepLogo((state) => state.addUserLogo);
  const replaceUserLogo = useStepLogo((state) => state.replaceUserLogo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    const src = await logoFileToDisplayUrl(file);
    await preloadLogoDisplayUrl(src);
    await yieldToMain();
    return src;
  }, []);

  const uploadLogo = useCallback(
    async (file: File, options?: { position?: StepLogoPositionState; partId?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const src = await processFile(file);
        const payload = { src, fileName: file.name };

        if (options?.partId) {
          replaceUserLogo(options.partId, payload);
          return;
        }

        if (options?.position) {
          assignLogoToPosition(options.position, payload);
          return;
        }

        const added = addUserLogo(payload);
        if (!added) {
          setError('Non è possibile aggiungere altri loghi');
        }
      } catch (err) {
        const message = err instanceof LogoFileError ? err.message : 'Impossibile caricare il file';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addUserLogo, assignLogoToPosition, processFile, replaceUserLogo],
  );

  return { uploadLogo, loading, error, setError };
};

export { useLogoFileHandler };
