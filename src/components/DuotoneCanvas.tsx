import { useEffect, useRef } from "react";
import { processDuotoneImage } from "@/lib/duotone-processor";
import { Loader2 } from "lucide-react";

interface DuotoneCanvasProps {
  file: File;
  onProcessingComplete: (url: string, dimensions: { width: number; height: number }) => void;
  onProcessingError: (error: string) => void;
  isProcessing: boolean;
  isReversed?: boolean;
}

export const DuotoneCanvas = ({ 
  file, 
  onProcessingComplete, 
  onProcessingError,
  isProcessing,
  isReversed = false
}: DuotoneCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const processImage = async () => {
      const canvas = canvasRef.current;
      if (!canvas || !file) return;

      try {
        const { processedCanvas, dimensions } = await processDuotoneImage(file, canvas, isReversed);
        
        // Convert canvas to blob and create URL
        processedCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            onProcessingComplete(url, dimensions);
          } else {
            onProcessingError("Failed to create processed image");
          }
        }, 'image/png', 1.0);
        
      } catch (error) {
        console.error('Processing error:', error);
        onProcessingError(error instanceof Error ? error.message : "Failed to process image");
      }
    };

    processImage();
  }, [file, onProcessingComplete, onProcessingError, isReversed]);

  return (
    <div className="space-y-4">
      {/* File Info */}
      <div className="text-center">
        <h3 className="font-medium text-lg mb-1">{file.name}</h3>
        <p className="text-sm text-muted-foreground">
          {Math.round(file.size / 1024)}KB
        </p>
      </div>

      {/* Canvas Container */}
      <div className="relative bg-muted/30 rounded-xl overflow-hidden border">
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm font-medium">Processing...</span>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-auto max-h-80 object-contain"
        />

        {!isProcessing && (
          <div className="absolute inset-0 processing-overlay pointer-events-none" />
        )}
      </div>

      {/* Result Info */}
      {!isProcessing && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            ✓ Duotone effect applied
          </p>
        </div>
      )}
    </div>
  );
};