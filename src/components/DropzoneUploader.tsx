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
    <div className="space-y-6 p-8">
      <div
        className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="p-6 rounded-full bg-gradient-duotone animate-glow">
              <Image className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <div className="absolute -inset-2 bg-gradient-duotone rounded-full opacity-20 animate-pulse-slow -z-10" />
          </div>
          
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-foreground">
              Drop your image here
            </h3>
            <p className="text-muted-foreground text-lg">
              or click to browse your files
            </p>
          </div>

          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 py-4 text-lg font-semibold interactive btn-glow animate-bounce-subtle"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className="w-5 h-5 mr-3" />
            Choose Image
          </Button>

          <input
            id="file-input"
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="text-sm text-muted-foreground text-center space-y-1 glass rounded-lg p-4">
            <p className="font-medium">Supports JPEG, PNG, WebP</p>
            <p className="text-xs">Maximum file size: 25MB</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="glass border border-destructive/20 rounded-xl p-6 animate-bounce-subtle">
          <p className="text-destructive text-center font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};