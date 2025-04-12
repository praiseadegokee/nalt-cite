import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GUIDELINE_OPTIONS = [
  { value: 'nalt-guideline-full', label: 'Complete NALT Guide' },
  { value: 'nalt-part1', label: 'Part 1: General Rules' },
  { value: 'nalt-part2', label: 'Part 2: Cases' },
  { value: 'nalt-part3', label: 'Part 3: Legislation' },
  { value: 'nalt-part4', label: 'Part 4: Secondary Sources' }
];

export default function Admin() {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState('nalt-guideline-full');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile) {
      // Only allow PDF files
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please select a PDF file.',
          variant: 'destructive'
        });
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      // File size validation (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'File size should be less than 10MB.',
          variant: 'destructive'
        });
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      setFile(selectedFile);
      setUploadStatus('idle');
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a PDF file to upload.',
        variant: 'destructive'
      });
      return;
    }
    
    // Create a new filename based on the selected type
    const newFileName = `${fileType}.pdf`;
    
    // Create a FormData object to send the file
    const formData = new FormData();
    
    // Create a new file object with the custom filename
    const customFile = new File([file], newFileName, {
      type: file.type,
      lastModified: file.lastModified
    });
    
    formData.append('pdfFile', customFile);
    
    setIsUploading(true);
    setUploadStatus('idle');
    
    try {
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUploadStatus('success');
        setUploadMessage(`Successfully uploaded ${newFileName}`);
        toast({
          title: 'Upload Successful',
          description: `The file has been uploaded as ${newFileName}`,
          variant: 'default'
        });
        
        // Reset the file input and state
        if (fileInputRef.current) fileInputRef.current.value = '';
        setFile(null);
      } else {
        setUploadStatus('error');
        setUploadMessage(data.message || 'Failed to upload file.');
        toast({
          title: 'Upload Failed',
          description: data.message || 'There was an error uploading the file.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage('Network error. Please try again.');
      toast({
        title: 'Upload Failed',
        description: 'There was a network error. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setUploadStatus('idle');
    setUploadMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NALT Guidelines Admin</h1>
          <p className="text-gray-600">Upload PDF documents for the NALT citation guidelines</p>
        </div>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Upload Guidelines PDF</CardTitle>
            <CardDescription>
              Select a document type and upload the corresponding PDF file.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="file-type">Document Type</Label>
              <Select
                value={fileType}
                onValueChange={(value) => setFileType(value)}
              >
                <SelectTrigger id="file-type" className="w-full">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {GUIDELINE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="pdf-upload">PDF File</Label>
              <div className="flex items-center gap-3">
                <Input 
                  id="pdf-upload"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="flex-1"
                />
              </div>
              {file && (
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="truncate">{file.name}</span>
                  <span className="ml-2">({Math.round(file.size / 1024)}KB)</span>
                </div>
              )}
            </div>
            
            {uploadStatus === 'success' && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{uploadMessage}</AlertDescription>
              </Alert>
            )}
            
            {uploadStatus === 'error' && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{uploadMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={resetForm}
              disabled={isUploading}
            >
              Reset
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="gap-2"
            >
              {isUploading ? 'Uploading...' : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload PDF
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            The uploaded files will be available for download on the Resources page.
          </p>
        </div>
      </div>
    </div>
  );
}