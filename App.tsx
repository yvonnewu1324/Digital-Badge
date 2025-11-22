import React from 'react';
import { LiquidBackground } from './components/LiquidBackground';
import { LiquidCard } from './components/LiquidCard';
import { CardData } from './types';

const CARD_DATA: CardData = {
  name: "Yu-Jie(Yvonne) Wu",
  role: "Software Engineer",
  bio: "Obsessed with simplicity and functional aesthetics. Building tools that think like you do.",
  email: "imyujiewu@example.com",
  website: "yu-jiewu.vercel.app",
  phone: "+1 (530) 750-6577",
  avatarUrl: "https://davvcdn.lon1.cdn.digitaloceanspaces.com/c718d30f896f72b4ae9185798485a7ba/5122b996cc2fc795d6bb.html",
};

const App: React.FC = () => {
  return (
    <div className="w-screen h-screen font-sans text-[#37352F] selection:bg-[#2EAADC]/30 overflow-hidden">
      <LiquidBackground />

      {/* Main Content - Full Screen */}
      <main className="w-full h-full flex items-center justify-center">
        <LiquidCard data={CARD_DATA} />
      </main>
    </div>
  );
};

export default App;
