
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { extractTitleAndSubtitle } from "@/lib/filename-parser";

interface ImageOptions {
  fullWidth: boolean;
  cropFromTop: boolean;
}

interface ImageSliderProps {
  images: string[];
  imageOptions?: Record<string, ImageOptions>;
}

const TRANSITION_DURATION = 300; // ms - reduced from 1000ms for faster transitions
const DISPLAY_DURATION = 4000; // ms (includes transition time)

// Define transition effects as requested
const transitions = [
  {
    entering: "opacity-0",
    exiting: "opacity-0",
    active: "transition-opacity duration-300 ease-in-out opacity-100", // reduced duration
    name: "fade" // fade through black
  },
  {
    entering: "translate-x-full",
    exiting: "-translate-x-full",
    active: "transition-all duration-300 ease-in-out translate-x-0", // reduced duration
    name: "wipe-left-to-right" // wipe from left to right
  },
  {
    entering: "-translate-x-full",
    exiting: "translate-x-full",
    active: "transition-all duration-300 ease-in-out translate-x-0", // reduced duration
    name: "wipe-right-to-left" // wipe from right to left
  },
  {
    entering: "scale-50 opacity-0",
    exiting: "scale-50 opacity-0",
    active: "transition-all duration-300 ease-in-out scale-100 opacity-100", // reduced duration
    name: "shrink-grow" // shrink and grow
  },
  {
    entering: "opacity-0 brightness-200",
    exiting: "opacity-0 brightness-200",
    active: "transition-all duration-300 ease-in-out opacity-100 brightness-100", // reduced duration
    name: "fade-through-white" // fade through white
  },
];

const ImageSlider: React.FC<ImageSliderProps> = ({ images, imageOptions = {} }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTransition, setCurrentTransition] = useState(transitions[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [mouseMovement, setMouseMovement] = useState(false);

  // For the demo, use these sample images and titles
  const sampleImages = [
    "/placeholder.svg", 
    "/placeholder.svg",
    "/placeholder.svg",
  ];
  
  const imagesWithMeta = images.length > 0 ? 
    images.map(img => {
      const { title, subtitle } = extractTitleAndSubtitle(img.split('/').pop() || '');
      return { 
        path: img, 
        title, 
        subtitle,
        options: imageOptions[img] || { fullWidth: false, cropFromTop: true }
      };
    }) : 
    sampleImages.map((img, index) => ({
      path: img,
      title: `Sample Project ${index + 1}`,
      subtitle: index === 0 ? "Web Application Design" : index === 1 ? "Brand Identity" : "UI/UX Design",
      options: { fullWidth: false, cropFromTop: true }
    }));

  const imagesCount = imagesWithMeta.length;

  const getRandomTransition = () => {
    const randomIndex = Math.floor(Math.random() * transitions.length);
    return transitions[randomIndex];
  };

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentTransition(getRandomTransition());
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesCount);
      setNextIndex((prevIndex) => (prevIndex + 1) % imagesCount);
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  }, [imagesCount, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentTransition(getRandomTransition());
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + imagesCount) % imagesCount);
      setNextIndex((prevIndex) => (prevIndex - 1 + imagesCount) % imagesCount);
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  }, [imagesCount, isTransitioning]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isPlaying && !isTransitioning) {
      timer = setTimeout(nextSlide, DISPLAY_DURATION);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentIndex, isPlaying, nextSlide, isTransitioning]);

  // Hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setControlsVisible(true);
      setMouseMovement(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    let timer: NodeJS.Timeout | null = null;
    if (mouseMovement) {
      timer = setTimeout(() => {
        setControlsVisible(false);
        setMouseMovement(false);
      }, 3000);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timer) clearTimeout(timer);
    };
  }, [mouseMovement]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getImageStyle = (index: number) => {
    const options = imagesWithMeta[index].options;
    
    if (options.fullWidth) {
      return {
        objectFit: "cover",
        objectPosition: options.cropFromTop ? "top" : "bottom"
      } as React.CSSProperties;
    }
    
    return {
      objectFit: "contain"
    } as React.CSSProperties;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Current slide */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div 
          className={cn(
            "w-full h-full flex flex-col items-center justify-center",
            isTransitioning ? currentTransition.exiting : currentTransition.active
          )}
        >
          <div className="relative max-w-[1200px] max-h-[80vh] mx-auto w-full h-full flex items-center justify-center">
            <img 
              src={imagesWithMeta[currentIndex].path} 
              alt={imagesWithMeta[currentIndex].title}
              className="max-w-full max-h-[80vh] mx-auto w-full"
              style={getImageStyle(currentIndex)}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <h2 className="text-2xl font-bold">{imagesWithMeta[currentIndex].title}</h2>
            <p className="text-lg opacity-80">{imagesWithMeta[currentIndex].subtitle}</p>
          </div>
        </div>
      </div>
      
      {/* Transition effect name indicator */}
      <div className={cn(
        "absolute top-16 right-4 bg-black/50 text-white/80 px-3 py-1 rounded-full transition-opacity duration-300",
        controlsVisible ? "opacity-100" : "opacity-0"
      )}>
        Effect: {currentTransition.name}
      </div>
      
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
        <div 
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex) / imagesCount) * 100}%` }}
        ></div>
      </div>
      
      {/* Controls */}
      <div className={cn(
        "absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 transition-opacity duration-300",
        controlsVisible ? "opacity-100" : "opacity-0"
      )}>
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full bg-black/50 border-white/20 hover:bg-white/20 text-white"
          onClick={prevSlide}
          disabled={isTransitioning}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full bg-black/50 border-white/20 hover:bg-white/20 text-white"
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full bg-black/50 border-white/20 hover:bg-white/20 text-white"
          onClick={nextSlide}
          disabled={isTransitioning}
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Slide counter */}
      <div className={cn(
        "absolute top-4 right-4 text-sm bg-black/50 text-white/80 px-3 py-1 rounded-full transition-opacity duration-300",
        controlsVisible ? "opacity-100" : "opacity-0"
      )}>
        {currentIndex + 1} / {imagesCount}
      </div>
    </div>
  );
};

export default ImageSlider;
