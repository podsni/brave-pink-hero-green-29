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
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-duotone bg-clip-text text-transparent mb-4">
            Brave Pink Hero Green 1312
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pink × Green duotone. Local & private.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Transform your photos with beautiful duotone effects. All processing happens in your browser.
          </p>
        </header>

        {/* Main content */}
        <main className="space-y-8">
          {!originalFile && !processedImage && (
            <Card className="p-8 shadow-card">
              <DropzoneUploader onFileSelect={handleFileSelect} />
            </Card>
          )}

          {error && (
            <Card className="p-6 border-destructive bg-destructive/5">
              <div className="text-center">
                <p className="text-destructive font-medium mb-4">{error}</p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </Card>
          )}

          {originalFile && (
            <Card className="p-6 shadow-card">
              <DuotoneCanvas
                file={originalFile}
                onProcessingComplete={handleProcessingComplete}
                onProcessingError={handleProcessingError}
                isProcessing={isProcessing}
                isReversed={isReversed}
              />
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleReverseToggle}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isProcessing}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>
                    <polyline points="7,13 12,18 17,13"/>
                    <polyline points="7,11 12,6 17,11"/>
                  </svg>
                  {isReversed ? 'Pink shadows, Green highlights' : 'Green shadows, Pink highlights'}
                </button>
              </div>
            </Card>
          )}

          {processedImage && (
            <ActionsBar
              processedImage={processedImage}
              onReset={handleReset}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            All processing happens locally in your browser. Your photos never leave your device.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;