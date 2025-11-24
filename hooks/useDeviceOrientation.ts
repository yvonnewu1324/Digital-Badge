import { useEffect, useRef, useCallback } from 'react';

/**
 * Global device orientation listener hook
 * Initializes listener immediately when app loads, not waiting for card to render
 * Handles permission detection and broadcasts orientation events
 */
export const useDeviceOrientation = () => {
  const hasNotifiedPermission = useRef(false);
  const listenerAdded = useRef(false);
  const listenersRef = useRef<Set<(event: DeviceOrientationEvent) => void>>(new Set());

  // Handler that processes orientation events
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    // Notify permission granted on first event received
    if (!hasNotifiedPermission.current) {
      hasNotifiedPermission.current = true;
      window.dispatchEvent(new CustomEvent('gyroPermissionGranted'));
    }

    // Broadcast to all registered listeners
    listenersRef.current.forEach(listener => {
      listener(event);
    });
  }, []);

  // Register a listener to receive orientation events
  const addListener = useCallback((listener: (event: DeviceOrientationEvent) => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  useEffect(() => {
    // Setup listener immediately when app loads
    const setupListener = () => {
      // Prevent duplicate listener addition
      if (listenerAdded.current) {
        return;
      }

      // Check if permission API exists (iOS 13+)
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        // On iOS, try to add listener first - if permission was already granted, this will work
        // handleOrientation will receive events and trigger 'gyroPermissionGranted' event
        try {
          window.addEventListener('deviceorientation', handleOrientation);
          listenerAdded.current = true;
        } catch (e) {
          console.error('Failed to add deviceorientation listener:', e);
        }
      } else {
        // For browsers that don't require permission, add listener directly
        window.addEventListener('deviceorientation', handleOrientation);
        listenerAdded.current = true;
        // Trigger permission granted event for non-iOS devices immediately
        // Only trigger if we haven't already notified
        if (!hasNotifiedPermission.current) {
          hasNotifiedPermission.current = true;
          window.dispatchEvent(new CustomEvent('gyroPermissionGranted'));
        }
      }
    };

    // Setup listener immediately
    setupListener();

    // Listen for permission granted event (when user grants permission via modal)
    // Only re-setup if listener wasn't already added (for iOS when user grants permission)
    const handlePermissionGranted = () => {
      // Only setup listener if it wasn't already added (iOS case)
      if (!listenerAdded.current) {
        setupListener();
      }
    };

    window.addEventListener('gyroPermissionGranted', handlePermissionGranted);

    return () => {
      window.removeEventListener('gyroPermissionGranted', handlePermissionGranted);
      window.removeEventListener('deviceorientation', handleOrientation);
      listenersRef.current.clear();
      listenerAdded.current = false;
      hasNotifiedPermission.current = false;
    };
  }, [handleOrientation]);

  return {
    addListener,
  };
};
