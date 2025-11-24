import { useState, useEffect, useRef } from 'react';
import { useIsIOS } from './useIsIOS';

/**
 * Hook to manage gyro permission modal visibility based on session state
 * Only shows modal on iOS devices (iPhone, iPad) which require permission
 * Listens to permission detection from useDeviceOrientation
 */
export const useGyroModal = () => {
  const [showGyroModal, setShowGyroModal] = useState(false);
  const hasCheckedPermission = useRef(false);
  const permissionGranted = useRef(false);
  const isIOS = useIsIOS();

  useEffect(() => {
    if (hasCheckedPermission.current) return;
    hasCheckedPermission.current = true;

    // Only iOS devices require permission for DeviceOrientationEvent
    if (isIOS) {
      // Check if permission API exists (iOS 13+)
      const needsPermission = typeof (DeviceOrientationEvent as any).requestPermission === 'function';
      
      if (needsPermission) {
        // Listen for permission granted event from useDeviceOrientation
        // useDeviceOrientation will detect if permission is already granted
        const handlePermissionCheck = () => {
          // Permission is already granted, don't show modal
          permissionGranted.current = true;
          setShowGyroModal(false);
        };

        window.addEventListener('gyroPermissionGranted', handlePermissionCheck);
        
        // If no permission granted event is received after a delay, show modal
        // This means useDeviceOrientation's listener didn't receive any events (permission needed)
        setTimeout(() => {
          // If permission wasn't granted, show modal
          if (!permissionGranted.current) {
            setShowGyroModal(true);
          }
          window.removeEventListener('gyroPermissionGranted', handlePermissionCheck);
        }, 500);
      }
      // If no permission API needed, don't show modal (older iOS or already working)
    }
    // For non-iOS devices, useDeviceOrientation handles permission detection
  }, [isIOS]);

  const handleModalClose = () => {
    setShowGyroModal(false);
  };

  const handlePermissionGranted = () => {
    setShowGyroModal(false);
    // Trigger a custom event to notify Badge that permission is granted
    window.dispatchEvent(new CustomEvent('gyroPermissionGranted'));
  };

  return {
    showGyroModal,
    handleModalClose,
    handlePermissionGranted,
  };
};
