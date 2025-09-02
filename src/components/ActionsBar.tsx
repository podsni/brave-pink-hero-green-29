import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, RotateCcw, Image } from "lucide-react";

interface ProcessedImage {
  url: string;
  filename: string;
  dimensions: { width: number; height: number };
}

interface ActionsBarProps {
  processedImage: ProcessedImage;
  onReset: () => void;
}

export const ActionsBar = ({ processedImage, onReset }: ActionsBarProps) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(processedImage.url);
      const blob = await response.blob();
      
      // Generate filename
      const originalName = processedImage.filename.replace(/\.[^/.]+$/, "");
      const downloadName = `${originalName}_brave-pink-hero-green-1312.png`;
      
      // Create download link
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const fileSizeKB = Math.round(processedImage.url.length * 0.75 / 1024); // Rough estimate

  return (
    <Card className="glass-strong shadow-drop interactive">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8">
        {/* Enhanced Preview and info */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={processedImage.url}
              alt="Processed duotone image"
              className="w-24 h-24 object-cover rounded-2xl shadow-lg border-2 border-border interactive"
            />
            <div className="absolute -top-3 -right-3 p-2 bg-gradient-duotone rounded-full shadow-lg animate-glow">
              <Image className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="text-left space-y-2">
            <h4 className="font-bold text-lg text-foreground">
              {processedImage.filename}
            </h4>
            <p className="text-sm text-muted-foreground font-medium">
              {processedImage.dimensions.width} × {processedImage.dimensions.height}px
            </p>
            <div className="glass rounded-lg px-3 py-1">
              <p className="text-xs font-medium text-primary">
                ~{fileSizeKB}KB PNG
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Actions */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onReset}
            className="flex items-center space-x-3 glass interactive hover:scale-105 btn-green-glow px-6 py-3"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="font-semibold">Replace Photo</span>
          </Button>
          
          <Button
            size="lg"
            onClick={handleDownload}
            className="bg-gradient-duotone hover:opacity-90 text-white shadow-lg flex items-center space-x-3 interactive hover:scale-105 btn-glow px-8 py-3 font-bold"
          >
            <Download className="w-5 h-5" />
            <span>Download PNG</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};