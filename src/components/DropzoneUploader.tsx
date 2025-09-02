import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";

interface DropzoneUploaderProps {
  onFileSelect: (file: File) => void;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const DropzoneUploader = ({ onFileSelect }: DropzoneUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, or WebP)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 25MB";
    }
    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="drop-zone" 
         onDragOver={handleDragOver}
         onDragLeave={handleDragLeave}
         onDrop={handleDrop}>
      
      <div className="flex flex-col items-center space-y-6 py-16">
        <div className="w-16 h-16 rounded-2xl bg-gradient-duotone flex items-center justify-center">
          <Image className="w-8 h-8 text-white" />
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">
            Drop image here
          </h3>
          <p className="text-muted-foreground text-sm">
            or click to browse
          </p>
        </div>

        <Button 
          onClick={() => document.getElementById('file-input')?.click()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose File
        </Button>

        <input
          id="file-input"
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="text-xs text-muted-foreground">
          JPEG, PNG, WebP • Max 25MB
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm text-center">{error}</p>
        </div>
      )}
    </div>
  );
};