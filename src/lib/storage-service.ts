
// A simple service to save and retrieve configuration from localStorage
interface ImageOptions {
  fullWidth: boolean;
  cropFromTop: boolean;
}

interface SlideConfig {
  selectedImages: string[];
  imageOptions: Record<string, ImageOptions>;
  lastUpdated: number;
}

const STORAGE_KEY = 'slide-presentation-config';

export const saveSlideConfig = (config: SlideConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    console.log('Slide configuration saved successfully');
  } catch (error) {
    console.error('Failed to save slide configuration:', error);
  }
};

export const loadSlideConfig = (): SlideConfig | null => {
  try {
    const storedConfig = localStorage.getItem(STORAGE_KEY);
    if (!storedConfig) {
      console.log('No saved configuration found');
      return null;
    }
    
    const config = JSON.parse(storedConfig) as SlideConfig;
    console.log('Loaded saved configuration from', new Date(config.lastUpdated));
    return config;
  } catch (error) {
    console.error('Failed to load slide configuration:', error);
    return null;
  }
};
