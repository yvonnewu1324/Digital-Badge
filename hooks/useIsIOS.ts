import { useMemo } from 'react';

/**
 * Hook to detect if the device is iOS (iPhone, iPad, or iPod)
 */
export const useIsIOS = (): boolean => {
  return useMemo(() => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);
};
