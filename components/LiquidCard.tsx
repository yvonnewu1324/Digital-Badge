import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CardData, CardStyle } from '../types';
import { Mail, Globe, Phone, Share2, ArrowUpRight } from 'lucide-react';

interface LiquidCardProps {
  data: CardData;
}

export const LiquidCard: React.FC<LiquidCardProps> = ({ data }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CardStyle>({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  
  const targetStyle = useRef<CardStyle>({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const requestRef = useRef<number>(0);

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const updatePhysics = useCallback(() => {
    // More responsive lerp for iframe-like direct rotation
    setStyle(prev => ({
      rotateX: lerp(prev.rotateX, targetStyle.current.rotateX, 0.1),
      rotateY: lerp(prev.rotateY, targetStyle.current.rotateY, 0.1),
      glareX: lerp(prev.glareX, targetStyle.current.glareX, 0.1),
      glareY: lerp(prev.glareY, targetStyle.current.glareY, 0.1),
    }));
    requestRef.current = requestAnimationFrame(updatePhysics);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updatePhysics]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Enhanced rotation for iframe-like 3D effect - more responsive
    const maxRotation = 30; // Increased for more dramatic effect like iframe
    const rotationIntensity = 15; // Increased for more responsive feel
    let rotateY = ((x - centerX) / centerX) * rotationIntensity; 
    let rotateX = ((y - centerY) / centerY) * -rotationIntensity;
    
    // Clamp rotations to prevent flipping to the back
    rotateY = Math.max(-maxRotation, Math.min(maxRotation, rotateY));
    rotateX = Math.max(-maxRotation, Math.min(maxRotation, rotateX));

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    targetStyle.current = { rotateX, rotateY, glareX, glareY };
  };

  const handleMouseLeave = () => {
    targetStyle.current = { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 };
  };

  // Gyroscope Handler - Direct mapping for iframe-like 3D effect
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let { beta, gamma } = event;
    if (beta === null || gamma === null) return;

    // Clamp to prevent excessive rotation that would show the back
    const maxRotation = 45; // Increased for more dramatic effect like iframe
    if (beta > maxRotation) beta = maxRotation;
    if (beta < -maxRotation) beta = -maxRotation;
    if (gamma > maxRotation) gamma = maxRotation;
    if (gamma < -maxRotation) gamma = -maxRotation;

    // More direct mapping for responsive 3D effect (like iframe)
    // Scale factor for sensitivity (0.8 gives smooth but responsive feel)
    const sensitivity = 0.8;
    
    targetStyle.current = {
      rotateX: -beta * sensitivity,
      rotateY: gamma * sensitivity,
      // Dynamic glare based on orientation
      glareX: 50 + (gamma * 1),
      glareY: 50 + (beta * 1),
    };
  }, []);

  useEffect(() => {
    const requestAccess = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          try {
            const response = await (DeviceOrientationEvent as any).requestPermission();
            if (response === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
            }
          } catch (e) {
            console.error(e);
          }
        } else {
           window.addEventListener('deviceorientation', handleOrientation);
        }
    };

    requestAccess();
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleOrientation]);

  const qrPayload = data.website ? `https://${data.website}` : data.email ? `mailto:${data.email}` : "https://example.com";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrPayload)}&bgcolor=FFFFFF&color=000000&margin=0`;

  return (
    <div className="flex flex-col items-center gap-8 perspective-[1500px] w-full">
      <div 
        className="relative group cursor-default w-full flex justify-center"
        style={{ perspective: '1500px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card Container - VERTICAL BADGE */}
        <div 
          ref={cardRef}
          className={`
            relative w-full max-w-[340px] h-[600px] bg-notion-bg
            rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-notion-border
            transition-transform duration-100 ease-linear overflow-hidden
          `}
          style={{
            transform: `rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg) scale3d(1, 1, 1)`,
            transformStyle: 'preserve-3d',
          }}
        >
            {/* Lanyard Hole Slot */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-3 bg-[#E5E5E5] rounded-full shadow-inner border border-black/5 z-20"></div>

            {/* Cover Image */}
            <div className="h-28 w-full bg-[#F3F3F3] relative border-b border-notion-border/50">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" 
                  alt="Cover"
                  className="w-full h-full object-cover opacity-80 grayscale-[20%]"
                />
            </div>

            {/* Content Body */}
            <div className="px-6 relative flex flex-col items-center text-center h-[calc(100%-112px)]">
                
                {/* Avatar Iframe Container */}
                <div className="-mt-16 mb-4 relative z-10 w-32 h-32 shrink-0 rounded-full border-[6px] border-white bg-white shadow-sm overflow-hidden group/avatar">
                   {data.avatarUrl ? (
                       <iframe 
                        src={data.avatarUrl} 
                        title="Avatar"
                        className="w-full h-full border-0 rounded-full"
                        scrolling="no"
                        frameBorder="0"
                        allow="accelerometer; gyroscope; magnetometer"
                       />
                   ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl rounded-full">
                             🦄
                        </div>
                   )}
                   {/* Shine effect on avatar glass */}
                   <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none mix-blend-overlay"></div>
                </div>

                {/* Name & Role */}
                <div className="mb-6 w-full">
                    <h1 className="text-2xl font-bold text-notion-text font-sans tracking-tight leading-tight">
                        {data.name || "Untitled"}
                    </h1>
                    <div className="mt-2">
                         <span className="bg-notion-tag text-notion-text px-2 py-0.5 rounded text-sm font-medium">
                            {data.role || "N/A"}
                        </span>
                    </div>
                </div>

                {/* Properties Grid - Vertical for Badge */}
                <div className="space-y-2 w-full text-sm text-left mb-auto">
                    
                    {/* Email Property */}
                    {data.email && (
                        <div className="flex items-center gap-3 py-1 border-b border-dashed border-gray-100">
                            <div className="w-6 flex justify-center text-notion-dim">
                                <Mail className="w-4 h-4" />
                            </div>
                            <a href={`mailto:${data.email}`} className="text-notion-text hover:underline decoration-notion-dim decoration-1 underline-offset-2 truncate flex-1">
                                {data.email}
                            </a>
                        </div>
                    )}

                    {/* Phone Property */}
                    {data.phone && (
                        <div className="flex items-center gap-3 py-1 border-b border-dashed border-gray-100">
                            <div className="w-6 flex justify-center text-notion-dim">
                                <Phone className="w-4 h-4" />
                            </div>
                            <span className="text-notion-text flex-1 truncate">
                                {data.phone}
                            </span>
                        </div>
                    )}

                    {/* Website Property */}
                    {data.website && (
                        <div className="flex items-center gap-3 py-1 border-b border-dashed border-gray-100">
                            <div className="w-6 flex justify-center text-notion-dim">
                                <Globe className="w-4 h-4" />
                            </div>
                            <a href={`https://${data.website}`} target="_blank" rel="noreferrer" className="text-notion-text hover:underline decoration-notion-dim decoration-1 underline-offset-2 flex items-center gap-1 flex-1 truncate">
                                {data.website}
                            </a>
                        </div>
                    )}
                </div>

                {/* Bio (Notion Quote Style) */}
                {data.bio && (
                    <div className="w-full mt-6 px-1 text-left">
                        <blockquote className="border-l-[3px] border-notion-text pl-4 py-1 my-2">
                            <p className="text-notion-text font-serif text-lg leading-relaxed">
                                {data.bio}
                            </p>
                        </blockquote>
                    </div>
                )}

                {/* QR Code (Bottom Area) */}
                <div className="mt-6 pt-4 border-t border-notion-border w-full flex justify-center pb-6">
                     <div className="w-20 h-20 bg-white border border-notion-border p-1.5 rounded-sm shadow-sm">
                         <img src={qrUrl} alt="QR" className="w-full h-full object-contain opacity-90 mix-blend-multiply" />
                     </div>
                </div>
            </div>

            {/* Simple Gloss/Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-50 mix-blend-overlay" />
        </div>
      </div>

      {/* Mobile Gyro Toggle removed as requested */}
    </div>
  );
};
