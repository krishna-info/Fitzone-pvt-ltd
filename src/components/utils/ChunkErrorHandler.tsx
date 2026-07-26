'use client';

import { useEffect } from 'react';

export function ChunkErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (
        reason &&
        (reason.name === 'ChunkLoadError' ||
          (typeof reason.message === 'string' &&
            (reason.message.includes('Loading chunk') ||
              reason.message.includes('Failed to fetch RSC payload'))))
      ) {
        console.warn('Chunk loading error detected. Reloading page for latest assets...');
        window.location.reload();
      }
    };

    const handleError = (event: ErrorEvent) => {
      if (
        event.message &&
        (event.message.includes('ChunkLoadError') || event.message.includes('Loading chunk'))
      ) {
        console.warn('Chunk error detected. Reloading page...');
        window.location.reload();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
