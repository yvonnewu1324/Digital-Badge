import React, { useState } from 'react';
import { Smartphone, X } from 'lucide-react';
import { useGyroPermission } from '../hooks/useGyroPermission';
import { useIsIOS } from '../hooks/useIsIOS';

interface GyroPermissionModalProps {
  onClose: () => void;
  onPermissionGranted: () => void;
}

const translations = {
  en: {
    title: 'Enable Gyroscope',
    description: 'To provide the best 3D interactive experience, we need your permission to use your device\'s gyroscope.',
    description2: 'This will allow the card to create dynamic effects based on your phone\'s movement.',
    allowButton: 'Allow Permission',
    requesting: 'Requesting...',
    skipButton: 'Skip for Now',
    close: 'Close',
    errorPermission: 'Gyroscope permission is required to use this feature. Please allow permission in your browser settings.',
    errorRequest: 'An error occurred while requesting permission. Please try again later.',
    note: 'You can change this permission anytime in your browser settings',
  },
  zh: {
    title: '啟用陀螺儀功能',
    description: '為了提供最佳的 3D 互動體驗，我們需要您的允許來使用裝置的陀螺儀。',
    description2: '這將讓卡片能夠根據您的手機移動而產生動態效果。',
    allowButton: '允許權限',
    requesting: '請求中...',
    skipButton: '稍後再說',
    close: '關閉',
    errorPermission: '需要陀螺儀權限才能使用此功能。請在瀏覽器設定中允許權限。',
    errorRequest: '請求權限時發生錯誤，請稍後再試。',
    note: '您可以在瀏覽器設定中隨時更改此權限',
  },
};

const getLanguage = (): 'en' | 'zh' => {
  const lang = navigator.language || (navigator as any).userLanguage;
  return lang.startsWith('zh') ? 'zh' : 'en';
};

export const GyroPermissionModal: React.FC<GyroPermissionModalProps> = ({ onClose, onPermissionGranted }) => {
  const [lang] = useState<'en' | 'zh'>(getLanguage());
  const t = translations[lang];
  const { isRequesting, error, requestGyroPermission } = useGyroPermission();
  const isIOS = useIsIOS();

  const handleRequestPermission = async () => {
    const granted = await requestGyroPermission();
    if (granted) {
      onPermissionGranted();
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isIOS) {
    // Only show modal on iOS devices (iPhone, iPad)
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-notion-border">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-notion-dim hover:text-notion-text transition-colors"
          aria-label={t.close}
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
          {t.title}
        </h2>

        {/* Description */}
        <p className="text-notion-dim text-center mb-6 leading-relaxed">
          {t.description}
          <br /><br />
          {t.description2}
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
            onClick={handleRequestPermission}
            disabled={isRequesting}
            className="w-full bg-notion-text text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRequesting ? t.requesting : t.allowButton}
          </button>
          <button
            onClick={handleSkip}
            disabled={isRequesting}
            className="w-full bg-notion-gray text-notion-text py-3 px-6 rounded-lg font-medium hover:bg-opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.skipButton}
          </button>
        </div>

        {/* Note */}
        <p className="text-xs text-notion-dim text-center mt-4">
          {t.note}
        </p>
      </div>
    </div>
  );
};
