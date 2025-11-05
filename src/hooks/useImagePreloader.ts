import { useState, useEffect } from 'react';

interface UseImagePreloaderProps {
  criticalImages: string[];
  backgroundImages?: string[];
}

interface UseImagePreloaderReturn {
  allImagesLoaded: boolean;
  criticalImagesLoaded: boolean;
  backgroundImagesLoaded: boolean;
  loadingProgress: number;
}

export const useImagePreloader = ({
  criticalImages,
  backgroundImages = []
}: UseImagePreloaderProps): UseImagePreloaderReturn => {
  const [criticalImagesLoaded, setCriticalImagesLoaded] = useState(false);
  const [backgroundImagesLoaded, setBackgroundImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let criticalLoaded = 0;
    let backgroundLoaded = 0;
    const totalImages = criticalImages.length + backgroundImages.length;

    const updateProgress = () => {
      const progress = (criticalLoaded + backgroundLoaded) / totalImages;
      setLoadingProgress(progress);
    };

    // Load critical images first
    const criticalPromises = criticalImages.map((src) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          criticalLoaded++;
          updateProgress();
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.all(criticalPromises).then(() => {
      setCriticalImagesLoaded(true);
      
      // Load background images after critical ones
      if (backgroundImages.length === 0) {
        setBackgroundImagesLoaded(true);
        return;
      }

      const backgroundPromises = backgroundImages.map((src) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            backgroundLoaded++;
            updateProgress();
            resolve();
          };
          img.onerror = reject;
          img.src = src;
        });
      });

      Promise.all(backgroundPromises).then(() => {
        setBackgroundImagesLoaded(true);
      }).catch(console.error);
    }).catch(console.error);
  }, [criticalImages, backgroundImages]);

  const allImagesLoaded = criticalImagesLoaded && backgroundImagesLoaded;

  return {
    allImagesLoaded,
    criticalImagesLoaded,
    backgroundImagesLoaded,
    loadingProgress
  };
};