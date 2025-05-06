
import { useEffect, useState } from "react";
import ImageSlider from "@/components/ImageSlider";
import UploadInstructions from "@/components/UploadInstructions";
import ImageSelector from "@/components/ImageSelector";
import { saveSlideConfig, loadSlideConfig } from "@/lib/storage-service";
import { toast } from "@/components/ui/use-toast";

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
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    // Load images from the /public/images directory
    const fetchImages = async () => {
      try {
        const imageFiles: string[] = [];
        
        // Get all image files from public/images directory
        const imageContext = import.meta.glob('/public/images/*.{jpg,jpeg,png}', { eager: true });
        
        for (const path in imageContext) {
          const fileName = path.split('/').pop() || '';
          if (fileName !== '.gitkeep' && fileName !== 'gitkeep.txt' && !fileName.startsWith('.')) {
            // Important: Use the correct path format for the browser
            const imagePath = path.replace('/public', '');
            imageFiles.push(imagePath);
          }
        }

        console.log("Found images:", imageFiles);
        setImages(imageFiles);
        
        // Initialize image options
        const initialOptions: Record<string, ImageOptions> = {};
        imageFiles.forEach(img => {
          initialOptions[img] = { fullWidth: false, cropFromTop: true };
        });
        
        // Try to load saved configuration
        const savedConfig = loadSlideConfig();
        
        if (savedConfig && savedConfig.selectedImages.length > 0) {
          // Verify that saved images still exist in the current image list
          const validSelectedImages = savedConfig.selectedImages.filter(
            img => imageFiles.includes(img)
          );
          
          // If we have valid selected images, use the saved configuration
          if (validSelectedImages.length > 0) {
            setSelectedImages(validSelectedImages);
            
            // Filter image options to only include existing images
            const validImageOptions: Record<string, ImageOptions> = {};
            for (const [key, value] of Object.entries(savedConfig.imageOptions)) {
              if (imageFiles.includes(key)) {
                validImageOptions[key] = value;
              }
            }
            
            setImageOptions(validImageOptions);
            toast({
              title: "Configuration loaded",
              description: `Loaded ${validSelectedImages.length} images from saved settings`,
            });
          } else {
            // If no valid images found in saved config, use all images
            setSelectedImages(imageFiles);
            setImageOptions(initialOptions);
          }
        } else {
          // No saved configuration, use all images
          setSelectedImages(imageFiles);
          setImageOptions(initialOptions);
        }
        
        setConfigLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading images:", error);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error loading images",
          description: "There was a problem loading your images. Please try again.",
        });
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
    
    // Save configuration to localStorage
    saveSlideConfig({
      selectedImages: selected,
      imageOptions: options || imageOptions,
      lastUpdated: Date.now()
    });
    
    toast({
      title: "Changes saved",
      description: `Presentation updated with ${selected.length} images`,
    });
    
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
              imageOptions={imageOptions}
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
