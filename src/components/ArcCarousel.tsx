import { motion } from "framer-motion";
import { useState } from "react";

// TypeScript interface defining the structure of each carousel item
interface ArcCarouselProps {
  items: {
    id: string;           // unique key
    title: string;        // e.g. "Into the Void"
    creator: string;      // e.g. "Michelle"
    category: 'Thread' | 'Video' | 'Graphic';
    imgSrc: string;       // thumbnail URL
  }[];
  radius?: number;        // default 480 (px)
  arcAngle?: number;      // visible slice in degrees, default 80°
  autoRotate?: boolean;   // default true
  rotationSpeed?: number; // seconds per revolution, default 20
}

// Helper function to convert degrees to radians for trigonometry calculations
const degToRad = (degrees: number) => (degrees * Math.PI) / 180;

// Helper function to calculate card positions along the circular arc
const calculateCardPosition = (index: number, totalItems: number, radius: number, arcAngle: number) => {
  // Distribute items evenly across the arc angle
  const angleStep = arcAngle / (totalItems - 1);
  const angle = (index * angleStep) - (arcAngle / 2); // Center the arc
  const radians = degToRad(angle);
  
  return {
    x: Math.sin(radians) * radius,
    z: Math.cos(radians) * radius,
    rotateY: -angle // Cards face the camera
  };
};

export default function ArcCarousel({
  items,
  radius = 480,
  arcAngle = 80,
  autoRotate = true,
  rotationSpeed = 20
}: ArcCarouselProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // This section handles the responsive behavior - on mobile (<640px), we skip 3D and show a horizontal carousel
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  if (isMobile) {
    return (
      <div className="w-full px-4 py-8">
        <motion.div
          className="flex gap-4 overflow-x-auto pb-4"
          drag="x"
          dragConstraints={{ left: -items.length * 200, right: 0 }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="min-w-[280px] bg-slate-900 rounded-2xl shadow-lg border border-[#4338ca] p-4"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={item.imgSrc}
                alt={item.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-slate-400 text-xs">by {item.creator}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-[#4338ca] text-white text-xs rounded">
                {item.category}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  // Desktop 3D arc carousel implementation
  return (
    <div className="relative w-full h-[600px] bg-zinc-950 overflow-hidden flex items-center justify-center">
      {/* Apply CSS perspective to the wrapper to create 3D depth effect */}
      <div
        className="relative w-full h-full"
        style={{ perspective: '1000px', perspectiveOrigin: 'center center' }}
      >
        {/* Main rotating container - this rotates continuously when autoRotate is enabled */}
        <motion.div
          className="relative w-full h-full preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
          animate={autoRotate ? { rotateY: 360 } : {}}
          transition={autoRotate ? {
            duration: rotationSpeed,
            repeat: Infinity,
            ease: "linear"
          } : {}}
        >
          {/* Render each card positioned along the circular arc */}
          {items.map((item, index) => {
            const position = calculateCardPosition(index, items.length, radius, arcAngle);
            
            // This section positions each card at calculated (x, z) coordinates around the arc
            // Each card's plane is perpendicular to the ring so it always faces the camera
            return (
              <motion.div
                key={item.id}
                className="absolute bg-slate-900 rounded-2xl shadow-lg/30 border border-[#4338ca] p-6 w-64 h-80"
                style={{
                  transform: `translate3d(${position.x}px, -50%, ${position.z}px) rotateY(${position.rotateY}deg)`,
                  transformOrigin: 'center center'
                }}
                whileHover={{ 
                  scale: 1.08, 
                  zIndex: 10,
                  transition: { type: "spring", stiffness: 300, damping: 25 }
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                {/* Card content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Thumbnail image */}
                  <div className="w-full h-32 bg-slate-800 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={item.imgSrc}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Category badge */}
                  <span className="inline-block w-fit px-3 py-1 bg-[#4338ca] text-white text-xs rounded-full mb-3">
                    {item.category}
                  </span>
                  
                  {/* Title and creator info */}
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    by {item.creator}
                  </p>
                  
                  {/* Hover details - shown only when this card is hovered */}
                  <motion.div
                    className="mt-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: hoveredIndex === index ? 1 : 0,
                      y: hoveredIndex === index ? 0 : 10
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <button className="w-full py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-lg transition-colors">
                      View Content
                    </button>
                  </motion.div>
                </div>
                
                {/* Subtle breathing effect glow on hover */}
                {hoveredIndex === index && (
                  <motion.div
                    className="absolute inset-0 bg-[#4338ca] rounded-2xl opacity-20 blur-sm -z-10"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      
      {/* Overlay text */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-20">
        <h2 className="text-3xl font-bold text-white mb-2">Featured Content</h2>
        <p className="text-slate-400">Discover amazing creations from our community</p>
      </div>
    </div>
  );
}