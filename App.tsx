import React from 'react';
import { Background } from './components/Background';
import { Badge } from './components/Badge';
import { GyroPermissionModal } from './components/GyroPermissionModal';
import { CardData } from './types';
import { useGyroModal } from './hooks/useGyroModal';
import { useDeviceOrientation } from './hooks/useDeviceOrientation';

const CARD_DATA: CardData = {
  name: "Yu-Jie(Yvonne) Wu 🦄",
  roles: ["Software Engineer", "Meme Lover"],
  tags: ["#AI", "#Tech", "#3D"],
  bio: "Love turning ideas into reality. Lets connect and make something cool together!",
  email: "imyujiewu@gmail.com",
  website: "yu-jiewu.vercel.app",
  phone: "+1 (530) 750-6577",
  linkedin: "https://www.linkedin.com/in/yu-jie-wu-a07823172", // Update with your LinkedIn URL
  avatarUrl: "/avatar.html", // https://davvcdn.lon1.cdn.digitaloceanspaces.com/c718d30f896f72b4ae9185798485a7ba/5122b996cc2fc795d6bb.html
};

const App: React.FC = () => {
  // Initialize device orientation listener immediately when app loads
  useDeviceOrientation();
  const { showGyroModal, handleModalClose, handlePermissionGranted } = useGyroModal();

  return (
    <div className="w-full h-full font-sans text-[#37352F] selection:bg-[#2EAADC]/30 overflow-hidden" style={{ touchAction: 'pan-y pan-x', overscrollBehavior: 'none' }}>
      <Background />

      {/* Main Content - Full Screen */}
      <main className="w-full h-full flex items-center justify-center overflow-hidden" style={{ overscrollBehavior: 'none' }}>
        <Badge data={CARD_DATA} />
      </main>

      {/* Gyro Permission Modal */}
      {showGyroModal && (
        <GyroPermissionModal
          onClose={handleModalClose}
          onPermissionGranted={handlePermissionGranted}
        />
      )}
    </div>
  );
};

export default App;
