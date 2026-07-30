/**
 * Converts any image File (JPG, PNG, GIF, BMP) to an optimized WebP Blob
 * directly inside the browser using HTML5 Canvas before uploading to server/R2.
 */
export async function convertToWebP(
  file: File, 
  quality = 0.85, 
  maxDimension = 1600
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If already a tiny webp file, resolve immediately
    if (file.type === 'image/webp' && file.size < 300 * 1024) {
      return resolve(file);
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Downscale image while maintaining aspect ratio if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to get canvas 2D context'));
        }
        
        // Draw image onto canvas with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas content to WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image to WebP format'));
            }
          },
          'image/webp',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image in browser'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file in browser'));
    };
    
    reader.readAsDataURL(file);
  });
}
