import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

// Interface for content items in the conveyor belt
interface ConveyorItem {
  id: string;
  title: string;
  category: string;
  author: string;
  description?: string;
  thumbnail_url?: string;
  file_url?: string;
}
interface ConveyorCarouselProps {
  items: ConveyorItem[];
  speed?: number; // px per second, default 90
  cardWidth?: number; // px, default 300
  gap?: number; // px, default 16
}
export default function ConveyorCarousel({
  items,
  speed = 90,
  cardWidth = 300,
  gap = 16
}: ConveyorCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [fastForwardDirection, setFastForwardDirection] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  // Responsive card sizing
  const responsiveCardWidth = typeof window !== 'undefined' && window.innerWidth < 640 ? 240 : cardWidth;
  const responsiveGap = typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : gap;

  // Calculate total width of all cards plus gaps
  const totalWidth = (responsiveCardWidth + responsiveGap) * items.length;

  // This part duplicates the card list so the loop never shows blanks
  // We create a seamless infinite scroll by repeating the items
  const duplicatedItems = [...items, ...items];

  // Update speed based on fast forward direction
  useEffect(() => {
    if (fastForwardDirection === 'right') {
      setCurrentSpeed(speed * 6);
    } else if (fastForwardDirection === 'left') {
      setCurrentSpeed(-speed * 6);
    } else {
      setCurrentSpeed(speed);
    }
  }, [fastForwardDirection, speed]);

  // Animation loop that moves cards continuously left to right
  useEffect(() => {
    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      if (!isPaused) {
        setOffset(prev => {
          const newOffset = prev + currentSpeed * deltaTime / 1000;
          // Reset when we've moved one full set of cards
          if (newOffset >= totalWidth) return 0;
          if (newOffset < 0) return totalWidth + newOffset;
          return newOffset;
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, currentSpeed, totalWidth]);

  // Manual navigation functions
  const navigateLeft = () => {
    setOffset(prev => {
      const newOffset = prev - (responsiveCardWidth + responsiveGap);
      return newOffset < 0 ? totalWidth + newOffset : newOffset;
    });
  };
  const navigateRight = () => {
    setOffset(prev => {
      const newOffset = prev + (responsiveCardWidth + responsiveGap);
      return newOffset >= totalWidth ? newOffset - totalWidth : newOffset;
    });
  };
  return <div className="w-full py-[18px]">
      {/* Conveyor belt container with overflow hidden */}
      <div ref={containerRef} className="relative w-full overflow-hidden" style={{
      height: `${responsiveCardWidth * 0.8}px`
    }}>
        {/* Moving track that contains all the cards */}
        <div className="flex absolute top-0 left-0 h-full" style={{
        transform: `translateX(-${offset}px)`,
        transition: isPaused ? 'transform 0.3s ease' : 'none',
        gap: `${responsiveGap}px`
      }}>
          {duplicatedItems.map((item, index) => <ConveyorCard key={`${item.id}-${index}`} item={item} width={responsiveCardWidth} onHover={isHovered => setIsPaused(isHovered)} />)}
        </div>
      </div>

      {/* Navigation arrows positioned below the belt */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button 
          variant="outline" 
          size="icon" 
          onMouseDown={() => setFastForwardDirection('left')}
          onMouseUp={() => setFastForwardDirection(null)}
          onMouseLeave={() => setFastForwardDirection(null)}
          className="rounded-full w-12 h-12 hover:bg-primary/10" 
          aria-label="Move left"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="text-sm text-muted-foreground px-4">
          {items.length} graphics
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          onMouseDown={() => setFastForwardDirection('right')}
          onMouseUp={() => setFastForwardDirection(null)}
          onMouseLeave={() => setFastForwardDirection(null)}
          className="rounded-full w-12 h-12 hover:bg-primary/10" 
          aria-label="Move right"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>;
}

// Individual card component that pauses scroll on hover
interface ConveyorCardProps {
  item: ConveyorItem;
  width: number;
  onHover: (isHovered: boolean) => void;
}
function ConveyorCard({
  item,
  width,
  onHover
}: ConveyorCardProps) {
  return <div className="flex-shrink-0 bg-card border border-border rounded-xl p-3 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden" style={{
    width: `${width}px`,
    height: `${width * 0.8}px`
  }} onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
      {/* Large image that fills most of the card */}
      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
        {(item.thumbnail_url || item.file_url) ? (
          <img 
            src={item.thumbnail_url || item.file_url} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-primary">XIONIMG</span>
        )}
        
        {/* Small label at the top */}
        <div className="absolute top-2 left-2 bg-primary/20 text-primary text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
          {item.category === 'graphics' ? 'Xion Graphic' : item.category}
        </div>
        
        {/* Small text at the bottom */}
        <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded backdrop-blur-sm">
          by {item.author}
        </div>
      </div>
    </div>;
}