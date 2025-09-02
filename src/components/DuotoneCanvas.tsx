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
    <div className="space-y-6 p-8">
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold mb-3">Processing Image</h3>
        <div className="glass rounded-full px-6 py-2 inline-block">
          <p className="text-sm font-medium">
            {file.name} • {Math.round(file.size / 1024)}KB
          </p>
        </div>
      </div>

      <div className="relative glass-strong rounded-2xl overflow-hidden shadow-drop">
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10">
            <div className="glass rounded-2xl p-6 flex items-center space-x-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="font-bold text-lg">Applying duotone effect...</span>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-auto max-h-96 object-contain"
          style={{ display: 'block' }}
        />

        {!isProcessing && (
          <div className="absolute inset-0 processing-overlay pointer-events-none" />
        )}
      </div>

      {!isProcessing && (
        <div className="text-center">
          <div className="glass rounded-2xl p-4 inline-block">
            <p className="text-sm font-medium">
              ✨ Duotone effect applied with {isReversed ? 'pink shadows and green highlights' : 'green shadows and pink highlights'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};