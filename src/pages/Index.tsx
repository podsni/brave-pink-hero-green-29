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
        {/* Enhanced Header */}
        <header className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-hero opacity-50 blur-3xl animate-pulse-slow -z-10" />
          
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-duotone bg-clip-text text-transparent mb-6 animate-gradient text-glow">
            Brave Pink Hero Green 1312
          </h1>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              Pink × Green duotone. Local & private.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Transform your photos with beautiful duotone effects. All processing happens in your browser — 
              your photos never leave your device.
            </p>
          </div>

          {/* Floating decoration elements */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-duotone rounded-full opacity-20 animate-float" />
          <div className="absolute -top-4 -right-12 w-8 h-8 bg-gradient-duotone rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}} />
          <div className="absolute top-20 -right-8 w-12 h-12 bg-gradient-duotone rounded-full opacity-15 animate-float" style={{animationDelay: '2s'}} />
        </header>

        {/* Main content */}
        <main className="space-y-8">
          {!originalFile && !processedImage && (
            <Card className="glass-strong shadow-drop interactive animate-bounce-subtle">
              <DropzoneUploader onFileSelect={handleFileSelect} />
            </Card>
          )}

          {error && (
            <Card className="glass border border-destructive/20 bg-destructive/5 interactive animate-bounce-subtle">
              <div className="text-center p-8">
                <p className="text-destructive font-bold mb-6 text-lg">{error}</p>
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-gradient-duotone text-white rounded-full hover:opacity-90 interactive btn-glow font-semibold"
                >
                  Try Again
                </button>
              </div>
            </Card>
          )}

          {originalFile && (
            <Card className="glass-strong shadow-drop interactive">
              <DuotoneCanvas
                file={originalFile}
                onProcessingComplete={handleProcessingComplete}
                onProcessingError={handleProcessingError}
                isProcessing={isProcessing}
                isReversed={isReversed}
              />
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleReverseToggle}
                  className="flex items-center gap-3 px-6 py-3 text-sm font-medium glass rounded-full interactive hover:scale-105 btn-glow"
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

        {/* Enhanced Footer */}
        <footer className="text-center mt-20 pt-12 border-t border-border/50">
          <div className="glass rounded-2xl p-6 inline-block">
            <p className="text-sm text-muted-foreground font-medium">
              🔒 All processing happens locally in your browser. Your photos never leave your device.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;