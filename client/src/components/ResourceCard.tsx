import { Download, ExternalLink, FileText, Copy, FileImage, Video } from 'lucide-react';
import { Resource } from '@/lib/types';

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  // Function to render the appropriate icon based on file type
  const renderIcon = () => {
    switch (resource.type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-[#1B387A]" />;
      case 'docx':
        return <Copy className="h-6 w-6 text-[#1B387A]" />;
      case 'image':
        return <FileImage className="h-6 w-6 text-[#1B387A]" />;
      case 'video':
        return <Video className="h-6 w-6 text-[#1B387A]" />;
      default:
        return <FileText className="h-6 w-6 text-[#1B387A]" />;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
      <div className="p-6">
        <div className="w-12 h-12 bg-[#C3CDE1]/30 rounded-full flex items-center justify-center mb-4">
          {renderIcon()}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{resource.title}</h3>
        <p className="text-gray-600 mb-4 text-sm">{resource.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <FileText className="h-4 w-4 mr-1" />
          {resource.type.toUpperCase()} {resource.size && `• ${resource.size}`}
        </div>
        
        <a 
          href={resource.downloadUrl} 
          className="inline-flex items-center py-2 px-4 border border-[#1B387A] text-[#1B387A] font-medium rounded hover:bg-[#1B387A] hover:text-white transition"
          download={resource.type !== 'video'}
        >
          {resource.type === 'video' ? (
            <>
              <ExternalLink className="h-4 w-4 mr-2" />
              Watch Videos
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download
            </>
          )}
        </a>
      </div>
    </div>
  );
}
