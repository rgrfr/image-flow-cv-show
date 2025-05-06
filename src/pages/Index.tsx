
import { useEffect, useState } from "react";
import ImageSlider from "@/components/ImageSlider";
import UploadInstructions from "@/components/UploadInstructions";
import ImageSelector from "@/components/ImageSelector";

interface ImageOptions {
  fullWidth: boolean;
  cropFromTop: boolean;
}

const Index = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);
  const [imageOptions, setImageOptions] = useState<Record<string, ImageOptions>>({});

  useEffect(() => {
    // Load images from the /public/images directory
    const fetchImages = async () => {
      try {
        const imageFiles = [];
        
        // In a real production environment, we would need a server-side solution
        // to read directory contents. For now, we'll attempt to find images with common patterns
        // from the /public/images/ directory
        
        // Get all image files from public/images directory
        const imageContext = import.meta.glob('/public/images/*.{jpg,jpeg,png}', { eager: true });
        
        for (const path in imageContext) {
          const fileName = path.split('/').pop() || '';
          if (fileName !== '.gitkeep' && fileName !== 'gitkeep.txt' && !fileName.startsWith('.')) {
            imageFiles.push(path.replace('/public', ''));
          }
        }
        
        setImages(imageFiles);
        setSelectedImages(imageFiles); // Initially select all images
        
        // Initialize image options
        const initialOptions: Record<string, ImageOptions> = {};
        imageFiles.forEach(img => {
          initialOptions[img] = { fullWidth: false, cropFromTop: true };
        });
        setImageOptions(initialOptions);
        
        console.log("Found images:", imageFiles);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading images:", error);
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleToggleSelector = () => {
    setShowSelector(!showSelector);
  };

  const handleSaveSelection = (selected: string[], options?: Record<string, ImageOptions>) => {
    setSelectedImages(selected);
    if (options) {
      setImageOptions(options);
    }
    setShowSelector(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse text-xl">Loading presentation...</div>
        </div>
      ) : images.length > 0 ? (
        <>
          <button 
            onClick={handleToggleSelector} 
            className="absolute top-4 left-4 z-50 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors"
          >
            {showSelector ? "Hide Selector" : "Configure Slides"}
          </button>
          
          {showSelector ? (
            <ImageSelector 
              images={images} 
              selectedImages={selectedImages} 
              onSave={handleSaveSelection} 
            />
          ) : (
            <ImageSlider 
              images={selectedImages} 
              imageOptions={imageOptions} 
            />
          )}
        </>
      ) : (
        <UploadInstructions />
      )}
    </div>
  );
};

export default Index;
