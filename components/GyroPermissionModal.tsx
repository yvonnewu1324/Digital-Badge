import React, { useState, useEffect } from 'react';
import { Smartphone, X } from 'lucide-react';

interface GyroPermissionModalProps {
  onClose: () => void;
  onPermissionGranted: () => void;
}

export const GyroPermissionModal: React.FC<GyroPermissionModalProps> = ({ onClose, onPermissionGranted }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
  };

  const requestGyroPermission = async () => {
    setIsRequesting(true);
    setError(null);

    try {
      // Request permission for main window
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          // Request permission for iframe via postMessage
          requestIframePermission();
          onPermissionGranted();
          onClose();
        } else {
          setError('需要陀螺儀權限才能使用此功能。請在瀏覽器設定中允許權限。');
        }
      } else {
        // For browsers that don't require permission (older versions)
        requestIframePermission();
        onPermissionGranted();
        onClose();
      }
    } catch (err) {
      console.error('Error requesting gyroscope permission:', err);
      setError('請求權限時發生錯誤，請稍後再試。');
    } finally {
      setIsRequesting(false);
    }
  };

  const requestIframePermission = () => {
    // Send message to iframe to request permission
    setTimeout(() => {
      const iframe = document.querySelector('iframe[src*="avatar.html"]') as HTMLIFrameElement;
      if (iframe) {
        const sendMessage = () => {
          try {
            if (iframe.contentWindow) {
              iframe.contentWindow.postMessage({ type: 'REQUEST_GYRO_PERMISSION' }, '*');
            }
          } catch (e) {
            console.log('Could not send message to iframe:', e);
          }
        };

        // Try immediately if iframe is already loaded
        sendMessage();

        // Also listen for load event
        iframe.addEventListener('load', sendMessage, { once: true });
      }
    }, 100);
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isMobile()) {
    // Don't show modal on desktop
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-notion-border">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-notion-dim hover:text-notion-text transition-colors"
          aria-label="關閉"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-notion-gray rounded-full flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-notion-text" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-notion-text text-center mb-3">
          啟用陀螺儀功能
        </h2>

        {/* Description */}
        <p className="text-notion-dim text-center mb-6 leading-relaxed">
          為了提供最佳的 3D 互動體驗，我們需要您的允許來使用裝置的陀螺儀。
          <br /><br />
          這將讓卡片能夠根據您的手機移動而產生動態效果。
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={requestGyroPermission}
            disabled={isRequesting}
            className="w-full bg-notion-text text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRequesting ? '請求中...' : '允許權限'}
          </button>
          <button
            onClick={handleSkip}
            disabled={isRequesting}
            className="w-full bg-notion-gray text-notion-text py-3 px-6 rounded-lg font-medium hover:bg-opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            稍後再說
          </button>
        </div>

        {/* Note */}
        <p className="text-xs text-notion-dim text-center mt-4">
          您可以在瀏覽器設定中隨時更改此權限
        </p>
      </div>
    </div>
  );
};
