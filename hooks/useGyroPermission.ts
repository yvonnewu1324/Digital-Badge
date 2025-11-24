import { useState } from 'react';

/**
 * Hook to handle gyroscope permission requests
 * Only iOS devices require explicit permission
 */
export const useGyroPermission = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestGyroPermission = async (): Promise<boolean> => {
    setIsRequesting(true);
    setError(null);

    try {
      // Request permission for main window
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          return true;
        } else {
          setError('Permission denied. Please try clearing website data or use Private/Incognito mode to reset permissions.');
          return false;
        }
      } else {
        // For browsers that don't require permission (older versions)
        return true;
      }
    } catch (err) {
      console.error('Error requesting gyroscope permission:', err);
      setError('An error occurred while requesting permission. Please try again later.');
      return false;
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    isRequesting,
    error,
    requestGyroPermission,
  };
};
