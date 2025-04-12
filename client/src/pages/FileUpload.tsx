import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'success' | 'error'>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
      
      if (pdfFiles.length < newFiles.length) {
        toast({
          title: "Non-PDF files ignored",
          description: "Only PDF files are accepted",
          variant: "destructive"
        });
      }
      
      setFiles(prev => [...prev, ...pdfFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File) => {
    setUploadStatus(prev => ({ ...prev, [file.name]: 'pending' }));
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
      
      return true;
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
      
      toast({
        title: "Upload failed",
        description: `Failed to upload ${file.name}`,
        variant: "destructive"
      });
      
      return false;
    }
  };

  const uploadAllFiles = async () => {
    setIsUploading(true);
    
    for (const file of files) {
      await uploadFile(file);
    }
    
    setIsUploading(false);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload PDF Files</h1>
          <p className="text-gray-600 mb-8">
            Upload PDF files for the NALT guidelines. Only PDF files are accepted.
          </p>
          
          {/* File upload area */}
          <Card 
            className={`border-2 ${isDragging ? 'border-primary border-dashed bg-primary/5' : 'border-gray-200'} p-6 mb-8`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Drag & Drop Files</h3>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Drop your PDF files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                accept="application/pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
            </CardContent>
          </Card>
          
          {/* File list */}
          {files.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Selected Files</CardTitle>
                <CardDescription>
                  {files.length} file{files.length !== 1 ? 's' : ''} selected for upload
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <li key={index} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {uploadStatus[file.name] === 'success' && (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        )}
                        {uploadStatus[file.name] === 'error' && (
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => setFiles([])}
                  disabled={isUploading}
                >
                  Clear All
                </Button>
                <Button 
                  onClick={uploadAllFiles}
                  disabled={files.length === 0 || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload All Files'}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Accepted File Types</h3>
                <p className="text-sm text-gray-600">Only PDF files are accepted.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">File Naming</h3>
                <p className="text-sm text-gray-600">
                  The system will use the original filename for the download. For NALT guideline parts, consider using 
                  consistent naming such as "NALT Guide Part 1 - General Rules.pdf".
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">File Size</h3>
                <p className="text-sm text-gray-600">Maximum file size is 50MB per PDF.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}