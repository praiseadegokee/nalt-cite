import React from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { guidelineParts } from '@/lib/data';

export default function GuidelineDownloads() {
  // Complete guide (first item) and individual parts (rest of the items)
  const completeGuide = guidelineParts[0];
  const individualParts = guidelineParts.slice(1);

  return (
    <div className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">NALT Guidelines Documents</h2>
          <p className="text-gray-600 mb-8 text-center">
            Download the official Nigerian Association of Law Teachers (NALT) citation guidelines 
            and reference materials for accurate legal citations.
          </p>

          {/* Main full guideline download card with cover image */}
          <Card className="mb-8 border-2 border-primary/20 shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Cover image section */}
              <div className="w-full md:w-1/3 bg-primary/5 flex items-center justify-center p-4">
                <div className="relative w-full aspect-[3/4] max-w-[240px] shadow-lg">
                  <img 
                    src="/cover-image" 
                    alt="NALT Guide Cover" 
                    className="object-cover w-full h-full rounded border border-gray-200"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = "https://placehold.co/240x320/e2e8f0/64748b?text=NALT+Guide";
                    }}
                  />
                </div>
              </div>
              
              {/* Content section */}
              <div className="flex-1 flex flex-col">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <FileText className="h-5 w-5" />
                    {completeGuide.title}
                  </CardTitle>
                  <CardDescription>
                    {completeGuide.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600">
                    The comprehensive guide containing all citation formats, rules, and examples for legal writing in Nigeria.
                    This document serves as the definitive resource for NALT citation standards.
                  </p>
                </CardContent>
                <CardFooter className="pt-2 flex justify-end">
                  <Button className="gap-2" asChild>
                    <a href={`/api/downloads/${completeGuide.filename}`} download>
                      <Download className="h-4 w-4" />
                      Download Complete Guide
                    </a>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>

          {/* Individual parts */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Individual Sections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {individualParts.map((part) => (
              <Card key={part.id} className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{part.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {part.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end pt-4">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={`/api/downloads/${part.filename}`} download>
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}