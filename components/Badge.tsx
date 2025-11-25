import React, { useState, useEffect } from 'react';
import { CardData } from '../types';
import { Mail, Globe, Phone } from 'lucide-react';
import { useCard3D } from '../hooks/useCard3D';

interface BadgeProps {
  data: CardData;
}

export const Badge: React.FC<BadgeProps> = ({ data }) => {
  const { cardRef, style, handleMouseMove, handleMouseLeave } = useCard3D();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const padding = 32; // Minimum padding around the card
      const baseWidth = 340;
      const baseHeight = 600;
      
      // Calculate scale to fit within the viewport while maintaining aspect ratio
      const scaleX = (window.innerWidth - padding) / baseWidth;
      const scaleY = (window.innerHeight - padding) / baseHeight;
      
      // Choose the smaller scale factor to fit both width and height
      // Allow scaling up to 1.2x for larger screens, but ensure it fits small screens
      const newScale = Math.min(scaleX, scaleY, 1.2);
      
      // Ensure scale doesn't get too small or negative
      setScale(Math.max(newScale, 0.3));
    };

    // Initial calculation
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const qrPayload = data.linkedin ? data.linkedin : data.website ? `https://${data.website}` : data.email ? `mailto:${data.email}` : "https://example.com";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrPayload)}&bgcolor=FFFFFF&color=000000&margin=0`;

  return (
    <div className="flex flex-col items-center justify-center gap-8 perspective-[1500px] w-full h-full">
      <div 
        className="relative group cursor-default flex justify-center items-center"
        style={{ perspective: '1500px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card Container - VERTICAL BADGE */}
        <div 
          ref={cardRef}
          className={`
            relative w-[340px] h-[600px] bg-notion-bg
            rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-notion-border
            transition-transform duration-100 ease-linear overflow-hidden
          `}
          style={{
            transform: `rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg) scale3d(${scale}, ${scale}, 1)`,
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
                <div className="-mt-16 mb-2 relative z-10 w-32 h-32 shrink-0 rounded-full border-[3px] border-white bg-white shadow-sm overflow-hidden group/avatar"
                  // style={{
                  //   maskImage: "radial-gradient(circle, white 99%, transparent 100%)",
                  //   WebkitMaskImage: "radial-gradient(circle, white 99%, transparent 100%)",
                  // }}
                >
                   {data.avatarUrl ? (
                     <div className="absolute inset-0 bg-white rounded-full">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white ">
                       <iframe
                       src={data.avatarUrl}
                       title="Avatar"
                       className="
                         w-full h-full border-0 
                         block bg-white 
                         will-change-transform 
                         [backface-visibility:hidden] 
                         [transform:translateZ(0)] 
                       "
                       scrolling="no"
                       frameBorder="0"
                       allow="accelerometer; gyroscope; magnetometer"
                     />
                      </div>
                     </div>
                   ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl rounded-full">
                             🦄
                        </div>
                   )}
                   {/* Shine effect on avatar glass */}
                   <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none mix-blend-overlay"></div>
                </div>

                {/* Name & Roles */}
                <div className="mb-2 w-full">
                    <h1 className="text-2xl font-bold text-notion-text font-sans tracking-tight leading-tight">
                        {data.name || "Untitled"}
                    </h1>
                    <div className="mt-2 flex flex-wrap gap-1.5 justify-center">
                         {data.roles && data.roles.length > 0 ? (
                            data.roles.map((role, index) => (
                                <span key={index} className="bg-notion-tag text-notion-text px-2 py-0.5 rounded text-sm font-medium">
                                    {role}
                                </span>
                            ))
                         ) : (
                            <span className="bg-notion-tag text-notion-text px-2 py-0.5 rounded text-sm font-medium">
                                N/A
                            </span>
                         )}
                    </div>
                    {/* Tags with random colors */}
                    {data.tags && data.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5 justify-center">
                            {data.tags.map((tag, index) => {
                                // Color palette for tags - assign colors based on index
                                const tagColors = [
                                    { bg: 'bg-blue-100', text: 'text-blue-700' },
                                    { bg: 'bg-purple-100', text: 'text-purple-700' },
                                    { bg: 'bg-pink-100', text: 'text-pink-700' },
                                    { bg: 'bg-green-100', text: 'text-green-700' },
                                    { bg: 'bg-yellow-100', text: 'text-yellow-700' },
                                    { bg: 'bg-orange-100', text: 'text-orange-700' },
                                    { bg: 'bg-red-100', text: 'text-red-700' },
                                    { bg: 'bg-indigo-100', text: 'text-indigo-700' },
                                    { bg: 'bg-teal-100', text: 'text-teal-700' },
                                    { bg: 'bg-cyan-100', text: 'text-cyan-700' },
                                ];
                                const color = tagColors[index % tagColors.length];
                                return (
                                    <span key={index} className={`${color.bg} ${color.text} px-2 py-0.5 rounded text-sm font-medium`}>
                                        {tag}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Properties Grid - Vertical for Badge */}
                <div className="space-y-1 w-full text-sm text-left mb-auto">
                    
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
                    <div className="w-full mt-2 px-1 text-left">
                        <blockquote className="border-l-[3px] border-notion-text pl-4 py-1 my-1">
                            <p className="text-notion-text font-serif text-lg leading-relaxed">
                                {data.bio}
                            </p>
                        </blockquote>
                    </div>
                )}

                {/* QR Code (Bottom Area) */}
                <div className="mt-2 pt-2 border-t border-notion-border w-full flex justify-center pb-6">
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
