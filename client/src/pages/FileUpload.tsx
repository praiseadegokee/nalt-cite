import { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Upload, FileText, Trash2, Download, CheckCircle, AlertCircle } from 'lucide-react';

export default function FileUpload() {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['/api/chat/documents'],
    queryFn: async () => {
      const res = await fetch('/api/chat/documents', { credentials: 'include' });
      if (!res.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/chat/upload-document', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `Failed to upload ${file.name}`);
        }
        
        return response.json();
      });
      
      return Promise.all(uploadPromises);
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/documents'] });
      const successCount = results.length;
      toast({ 
        title: 'Success', 
        description: `${successCount} document${successCount > 1 ? 's' : ''} uploaded and processed successfully` 
      });
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      toast({ title: 'Error', description: `Upload failed: ${error.message}`, variant: 'destructive' });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/chat/documents/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/documents'] });
      toast({ title: 'Success', description: 'Document deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Failed to delete document: ${error.message}`, variant: 'destructive' });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadMutation.mutate(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadMutation.mutate(e.target.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base Management</h1>
        <p className="text-gray-600">
          Upload legal documents to enhance the AI chatbot's knowledge base. Supported formats: PDF, TXT, DOC, DOCX
        </p>
      </div>

      {/* Upload Area */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-600" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900 mb-1">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  PDF, TXT, DOC, DOCX files up to 10MB each
                </p>
              </div>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {uploadMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Select Files'
                )}
              </Button>
            </div>
          </div>

          {/* Upload Guidelines */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Recommended Documents:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Nigerian court rules and practice directions</li>
              <li>• Legal writing style guides</li>
              <li>• Citation format examples and templates</li>
              <li>• Updated NALT and OSCOLA guidelines</li>
              <li>• Case law with proper citation examples</li>
              <li>• Statute citation reference materials</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded Documents ({documents.length})
            </span>
            {documents.length > 0 && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Knowledge Base Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No documents uploaded yet</p>
              <p className="text-sm text-gray-400">Upload legal documents to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{doc.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500">{doc.filename}</span>
                      <Badge 
                        variant={doc.documentType === 'nalt' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {doc.documentType?.toUpperCase() || 'NALT'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/api/downloads/${doc.filename}`, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(doc.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}