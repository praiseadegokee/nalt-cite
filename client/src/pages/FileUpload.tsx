import React, { useState, useRef } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Only PDF files are allowed',
          variant: 'destructive'
        });
        return;
      }
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(interval);
      
      if (response.ok) {
        setUploadProgress(100);
        setUploadStatus('success');
        toast({
          title: 'Upload successful',
          description: `${selectedFile.name} has been uploaded successfully.`,
        });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      setUploadStatus('error');
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">NALT Guidelines PDF Upload</h1>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Upload PDF Files</CardTitle>
              <CardDescription>
                Upload your NALT guideline PDF files to make them available for download.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`border-2 border-dashed rounded-lg p-12 text-center hover:bg-gray-50 transition cursor-pointer
                  ${selectedFile ? 'border-primary' : 'border-gray-300'}`}
                onClick={handleButtonClick}
              >
                <input 
                  type="file" 
                  className="hidden"
                  accept=".pdf" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                
                {selectedFile ? (
                  <div>
                    <p className="font-medium text-primary mb-1">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium mb-1">Drag & drop your file here or click to browse</p>
                    <p className="text-sm text-gray-500">PDF files only (max 50MB)</p>
                  </div>
                )}
              </div>

              {uploadStatus === 'uploading' && (
                <div className="mt-6">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center mt-2 text-sm text-gray-600">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
              
              {uploadStatus === 'success' && (
                <div className="mt-6 text-center text-green-600 flex items-center justify-center">
                  <Check className="h-5 w-5 mr-2" />
                  <span>File uploaded successfully!</span>
                </div>
              )}
              
              {uploadStatus === 'error' && (
                <div className="mt-6 text-center text-red-600 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>Upload failed. Please try again.</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedFile(null);
                  setUploadStatus('idle');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                disabled={!selectedFile || uploading}
              >
                Cancel
              </Button>
              <Button 
                onClick={uploadFile} 
                disabled={!selectedFile || uploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Instructions</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="list-decimal pl-5 space-y-3">
                <li>Click on the upload area above to select a PDF file or drag and drop it.</li>
                <li>The file should be the NALT Guideline or one of its parts in PDF format.</li>
                <li>Click the "Upload" button to upload the file to the server.</li>
                <li>After successful upload, the file will be available in the Resources section.</li>
                <li>To match the file with its correct section, please follow the naming convention:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Complete Guide:</strong> "NALT Uniform Format and Citation Guide for Legal Research Writing in Nigeria.pdf"</li>
                    <li><strong>Part 1:</strong> "NALT Guide Part 1 - General Rules.pdf"</li>
                    <li><strong>Part 2:</strong> "NALT Guide Part 2 - Cases.pdf"</li>
                    <li><strong>Part 3:</strong> "NALT Guide Part 3 - Legislation.pdf"</li>
                    <li><strong>Part 4:</strong> "NALT Guide Part 4 - Secondary Sources.pdf"</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}