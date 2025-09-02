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
    <Card className="p-6 shadow-card">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Preview and info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={processedImage.url}
              alt="Processed duotone image"
              className="w-20 h-20 object-cover rounded-lg shadow-sm border"
            />
            <div className="absolute -top-2 -right-2 p-1 bg-primary rounded-full">
              <Image className="w-3 h-3 text-primary-foreground" />
            </div>
          </div>
          
          <div className="text-left">
            <h4 className="font-semibold text-foreground">
              {processedImage.filename}
            </h4>
            <p className="text-sm text-muted-foreground">
              {processedImage.dimensions.width} × {processedImage.dimensions.height}px
            </p>
            <p className="text-xs text-muted-foreground">
              ~{fileSizeKB}KB PNG
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onReset}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replace Photo</span>
          </Button>
          
          <Button
            size="lg"
            onClick={handleDownload}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};