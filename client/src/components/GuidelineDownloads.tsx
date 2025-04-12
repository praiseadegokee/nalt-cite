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

// Define the guideline parts
const guidelineParts = [
  {
    id: 'complete-guide',
    title: 'NALT Citation Guidelines - Complete',
    description: 'The complete NALT Uniform Format and Citation Guide document',
    filename: 'NALT Uniform Format and Citation Guide for Legal Research Writing in Nigeria'
  },
  {
    id: 'part1',
    title: 'Part 1: Background Information',
    description: 'Background information to NALT Format',
    filename: 'NALT Uniform Format and Citation Guide (Part One - Background Information to NALT Format)'
  },
  {
    id: 'part2',
    title: 'Part 2: Cases',
    description: 'Guidelines for citing reported and unreported cases',
    filename: 'NALT Guide Part 2 - Cases'
  },
  {
    id: 'part3',
    title: 'Part 3: Legislation',
    description: 'Rules for citing constitutions, statutes, and regulations',
    filename: 'NALT Guide Part 3 - Legislation'
  },
  {
    id: 'part4',
    title: 'Part 4: Secondary Sources',
    description: 'Guidance for citing books, journals, and online resources',
    filename: 'NALT Guide Part 4 - Secondary Sources'
  }
];

export default function GuidelineDownloads() {
  return (
    <div className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">NALT Guidelines Documents</h2>
          <p className="text-gray-600 mb-8 text-center">
            Download the official Nigerian Association of Law Teachers (NALT) citation guidelines 
            and reference materials for accurate legal citations.
          </p>

          {/* Main full guideline download card */}
          <Card className="mb-8 border-2 border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                {guidelineParts[0].title}
              </CardTitle>
              <CardDescription>
                {guidelineParts[0].description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-6 flex justify-end">
              <Button className="gap-2" asChild>
                <a href={`/api/downloads/${guidelineParts[0].filename}`} download>
                  <Download className="h-4 w-4" />
                  Download Complete Guide
                </a>
              </Button>
            </CardFooter>
          </Card>

          {/* Individual parts */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Individual Sections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Only show Part 1 for now as it's the only one uploaded besides the complete guide */}
            {guidelineParts.slice(1, 2).map((part) => (
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