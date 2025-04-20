import { 
  Download, 
  ExternalLink, 
  FileText, 
  Copy, 
  FileImage, 
  Video, 
  Clock, 
  ArrowRight,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { Resource } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useState } from 'react';

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  
  // Function to get icon and colors based on file type
  const getResourceTypeInfo = () => {
    switch (resource.type) {
      case 'pdf':
        return {
          icon: FileText,
          bgColor: 'bg-red-100',
          textColor: 'text-red-600',
          hoverBgColor: 'group-hover:bg-red-600',
          hoverTextColor: 'group-hover:text-white',
          label: 'PDF Document',
          iconClass: 'group-hover:rotate-3 transition-transform'
        };
      case 'docx':
        return {
          icon: Copy,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600',
          hoverBgColor: 'group-hover:bg-blue-600',
          hoverTextColor: 'group-hover:text-white',
          label: 'Word Document',
          iconClass: 'group-hover:rotate-3 transition-transform'
        };
      case 'image':
        return {
          icon: FileImage,
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-600',
          hoverBgColor: 'group-hover:bg-purple-600',
          hoverTextColor: 'group-hover:text-white',
          label: 'Image File',
          iconClass: 'group-hover:rotate-3 transition-transform'
        };
      case 'video':
        return {
          icon: Video,
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-600',
          hoverBgColor: 'group-hover:bg-amber-600',
          hoverTextColor: 'group-hover:text-white',
          label: 'Video Tutorial',
          iconClass: 'group-hover:scale-110 transition-transform'
        };
      default:
        return {
          icon: FileText,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          hoverBgColor: 'group-hover:bg-gray-600',
          hoverTextColor: 'group-hover:text-white',
          label: 'Document',
          iconClass: 'group-hover:rotate-3 transition-transform'
        };
    }
  };

  const { 
    icon: TypeIcon, 
    bgColor, 
    textColor, 
    hoverBgColor,
    hoverTextColor,
    label,
    iconClass
  } = getResourceTypeInfo();

  const handleDownload = () => {
    if (resource.type === 'video') return;
    
    setIsDownloading(true);
    
    // Simulate download completion after 1.5 seconds
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadComplete(true);
      
      // Reset the download complete state after 3 seconds
      setTimeout(() => {
        setDownloadComplete(false);
      }, 3000);
    }, 1500);
  };

  return (
    <Card className="overflow-hidden border border-gray-200 hover:border-primary/30 transition-all duration-300 hover:shadow-md group h-full flex flex-col">
      <CardHeader className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full ${bgColor} ${hoverBgColor} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}>
            <TypeIcon className={`h-5 w-5 ${textColor} ${hoverTextColor} ${iconClass} duration-300`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200 line-clamp-1">{resource.title}</h3>
            <Badge variant="outline" className={`mt-1 text-xs ${textColor} border-current/30 group-hover:border-current/80 transition-all`}>
              {label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow">
        <p className="text-gray-600 text-sm min-h-[3rem] line-clamp-3">{resource.description}</p>
        
        <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 mt-4 mb-1">
          <div className="flex items-center bg-gray-100 py-1 px-2 rounded-full">
            <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
            <span>Latest version</span>
          </div>
          {resource.size && (
            <Badge variant="secondary" className="text-xs font-normal">
              {resource.size}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button 
          variant={resource.type === 'video' ? "outline" : "default"}
          size="sm"
          className={`gap-2 w-full font-medium ${resource.type === 'video' ? 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200' : 'shadow-sm'}`}
          asChild={!isDownloading && !downloadComplete}
          onClick={resource.type !== 'video' ? handleDownload : undefined}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="truncate">Downloading...</span>
            </>
          ) : downloadComplete ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span className="truncate">Downloaded</span>
            </>
          ) : resource.type === 'video' ? (
            <a 
              href={resource.downloadUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center"
            >
              <Video className="h-4 w-4 mr-2 text-amber-600" />
              <span className="truncate">Watch Tutorial</span>
              <ExternalLink className="h-3.5 w-3.5 ml-2 opacity-70" />
            </a>
          ) : (
            <a 
              href={resource.downloadUrl} 
              download
              className="flex w-full items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="truncate">Download {resource.type.toUpperCase()}</span>
            </a>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
