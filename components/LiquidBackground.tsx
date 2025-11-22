import React from 'react';

export const LiquidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#F7F7F5] pointer-events-none">
      {/* Dot Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(#D3D1CB 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};