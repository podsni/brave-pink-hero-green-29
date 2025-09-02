import { useState } from "react";
import { DropzoneUploader } from "@/components/DropzoneUploader";
import { DuotoneCanvas } from "@/components/DuotoneCanvas";
import { ActionsBar } from "@/components/ActionsBar";
import { Card } from "@/components/ui/card";

interface ProcessedImage {
  url: string;
  filename: string;
  dimensions: { width: number; height: number };
}

const Index = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReversed, setIsReversed] = useState(false);

  const handleFileSelect = (file: File) => {
    setError(null);
    setOriginalFile(file);
    setProcessedImage(null);
    setIsProcessing(true);
  };

  const handleReverseToggle = () => {
    setIsReversed(!isReversed);
    if (originalFile) {
      setProcessedImage(null);
      setIsProcessing(true);
    }
  };

  const handleProcessingComplete = (url: string, dimensions: { width: number; height: number }) => {
    if (originalFile) {
      setProcessedImage({
        url,
        filename: originalFile.name,
        dimensions
      });
    }
    setIsProcessing(false);
  };

  const handleProcessingError = (errorMessage: string) => {
    setError(errorMessage);
    setIsProcessing(false);
  };

  const handleReset = () => {
    if (processedImage?.url) {
      URL.revokeObjectURL(processedImage.url);
    }
    setOriginalFile(null);
    setProcessedImage(null);
    setError(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Minimalist Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-duotone bg-clip-text text-transparent mb-3">
            Duotone Editor
          </h1>
          <p className="text-muted-foreground">
            Pink × Green duotone filter
          </p>
        </header>

        {/* Main content */}
        <main className="space-y-8">
          {!originalFile && !processedImage && (
            <div className="max-w-lg mx-auto">
              <DropzoneUploader onFileSelect={handleFileSelect} />
            </div>
          )}

          {error && (
            <div className="max-w-md mx-auto text-center p-6 bg-destructive/5 border border-destructive/20 rounded-xl">
              <p className="text-destructive mb-4">{error}</p>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {originalFile && (
            <div className="max-w-2xl mx-auto">
              <DuotoneCanvas
                file={originalFile}
                onProcessingComplete={handleProcessingComplete}
                onProcessingError={handleProcessingError}
                isProcessing={isProcessing}
                isReversed={isReversed}
              />
              {!isProcessing && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleReverseToggle}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>
                      <polyline points="7,13 12,18 17,13"/>
                      <polyline points="7,11 12,6 17,11"/>
                    </svg>
                    {isReversed ? 'Pink shadows' : 'Green shadows'}
                  </button>
                </div>
              )}
            </div>
          )}

          {processedImage && (
            <ActionsBar
              processedImage={processedImage}
              onReset={handleReset}
            />
          )}
        </main>

        {/* Simple Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            Local processing • Your photos never leave your device
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;