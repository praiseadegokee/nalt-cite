import React, { useState } from 'react';
import { Download, FileText, BookOpen, BookOpenCheck, Check, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState("complete");
  
  // Complete guide (first item) and individual parts (rest of the items)
  const completeGuide = guidelineParts[0];
  const individualParts = guidelineParts.slice(1);

  return (
    <div className="py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 px-3 py-1 border-primary/30 text-primary/80">
              Official Resources
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">NALT Guidelines Documents</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access the complete NALT citation guidelines and resources to ensure your legal research 
              follows the standardized Nigerian citation format.
            </p>
          </div>
          
          <Tabs 
            defaultValue="complete" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="complete" className="flex items-center gap-2">
                  <BookOpenCheck className="h-4 w-4" />
                  <span>Complete Guide</span>
                </TabsTrigger>
                <TabsTrigger value="sections" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Individual Sections</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="complete" className="pt-4">
              <Card className="border-2 border-primary/20 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-primary/5">
                <div className="flex flex-col md:flex-row">
                  {/* Cover image section */}
                  <div className="w-full md:w-1/3 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-6">
                    <div className="relative w-full max-w-[300px] shadow-lg transition-transform duration-300 hover:scale-[1.02]">
                      <img 
                        src="/cover-image" 
                        alt="NALT Guide Cover" 
                        className="object-contain w-full rounded-md border border-gray-200"
                        style={{ maxHeight: '360px' }}
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          (e.target as HTMLImageElement).src = "https://placehold.co/400x300/e2e8f0/64748b?text=NALT+Guide";
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Content section */}
                  <div className="flex-1 flex flex-col">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-primary text-2xl">
                            <FileText className="h-6 w-6" />
                            {completeGuide.title}
                          </CardTitle>
                          <CardDescription className="mt-2 text-base">
                            {completeGuide.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          Complete
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow py-4">
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          The comprehensive guide containing all citation formats, rules, and examples for legal writing in Nigeria.
                          This document serves as the definitive resource for NALT citation standards.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Complete citation formats for all legal source types</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Detailed examples and explanations</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Official Nigerian Association of Law Teachers standards</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex flex-wrap gap-3 justify-end border-t border-gray-100 bg-gray-50/50 p-4">
                      <Button size="lg" className="gap-2 shadow-sm" asChild>
                        <a href={`/api/downloads/${completeGuide.filename}`} download>
                          <Download className="h-4 w-4" />
                          Download Complete Guide
                        </a>
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="sections" className="pt-4 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {individualParts.map((part, index) => (
                  <Card 
                    key={part.id} 
                    className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex h-full flex-col">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary">
                                <span className="text-sm font-bold">{index + 1}</span>
                              </div>
                              {part.title}
                            </CardTitle>
                            <CardDescription className="mt-2">
                              {part.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow py-4">
                        <p className="text-sm text-gray-600">
                          {`Section ${index + 1} of the NALT Citation Guidelines focusing on ${part.title.split(' - ')[1] || part.title}.`}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-4 border-t border-gray-100 bg-gray-50/50">
                        <span className="text-xs text-gray-500 flex items-center">
                          <FileText className="h-3 w-3 mr-1" /> 
                          PDF Document
                        </span>
                        <Button variant="outline" size="sm" className="gap-2 font-medium" asChild>
                          <a href={`/api/downloads/${part.filename}`} download>
                            <Download className="h-3.5 w-3.5" />
                            Download Section {index + 1}
                          </a>
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex gap-3 items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">Need the complete guidelines?</h4>
                    <p className="text-sm text-blue-700">
                      Download the complete guide for comprehensive citation instructions and all sections in one document.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto whitespace-nowrap text-blue-700 border-blue-200 hover:bg-blue-100"
                    onClick={() => setActiveTab("complete")}
                  >
                    View Complete Guide
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}