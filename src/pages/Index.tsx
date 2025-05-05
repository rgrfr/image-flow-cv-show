
import { useEffect, useState } from "react";
import ImageSlider from "@/components/ImageSlider";
import UploadInstructions from "@/components/UploadInstructions";

const Index = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is just for development, in the real app we'll load the images from the /images folder
    const fetchImages = async () => {
      try {
        // Simulating image loading from a directory
        // In the actual implementation, this will look for files in the /public/images/ directory
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading images:", error);
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse text-xl">Loading presentation...</div>
        </div>
      ) : images.length > 0 ? (
        <ImageSlider images={images} />
      ) : (
        <UploadInstructions />
      )}
    </div>
  );
};

export default Index;
