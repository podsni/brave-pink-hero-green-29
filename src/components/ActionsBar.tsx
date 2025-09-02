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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-card rounded-xl border">
      {/* Image Preview */}
      <div className="flex items-center space-x-4">
        <img
          src={processedImage.url}
          alt="Result"
          className="w-16 h-16 object-cover rounded-lg border"
        />
        <div>
          <h4 className="font-medium">{processedImage.filename}</h4>
          <p className="text-sm text-muted-foreground">
            {processedImage.dimensions.width} × {processedImage.dimensions.height}px • ~{fileSizeKB}KB
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Image
        </Button>
        
        <Button
          onClick={handleDownload}
          className="bg-primary hover:bg-primary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
};