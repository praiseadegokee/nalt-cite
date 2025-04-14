import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Book, 
  Upload, 
  FileText, 
  Globe, 
  Settings,
  Users,
  LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1B387A]">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your NALT citation resources</p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          asChild
        >
          <Link href="/">
            <Globe className="h-4 w-4" />
            View Public Site
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Blog Management */}
        <Card className="hover:shadow-md transition">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#1B387A]">Blog Posts</CardTitle>
            <CardDescription>Manage blog posts and articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="h-5 w-5 mr-2 text-[#294D98]" />
              <span>Write and publish informative articles</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild className="w-full">
              <Link href="/admin/blog">
                Manage Blog Posts
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Glossary Management */}
        <Card className="hover:shadow-md transition">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#1B387A]">Glossary</CardTitle>
            <CardDescription>Manage legal citation terms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Book className="h-5 w-5 mr-2 text-[#294D98]" />
              <span>Add and edit citation terminology</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild className="w-full">
              <Link href="/admin/glossary/add">
                Add New Glossary Term
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* File Upload */}
        <Card className="hover:shadow-md transition">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#1B387A]">Resource Files</CardTitle>
            <CardDescription>Upload PDF and document resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Upload className="h-5 w-5 mr-2 text-[#294D98]" />
              <span>Upload NALT guide files and resources</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild className="w-full">
              <Link href="/admin/upload">
                Upload Files
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-10 bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h2 className="text-xl font-semibold text-[#1B387A] mb-4">Admin Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 px-4 justify-start" asChild>
            <Link href="/glossary">
              <Globe className="h-5 w-5 mr-2 text-[#294D98]" />
              <div className="text-left">
                <div className="font-medium">Glossary</div>
                <div className="text-xs text-muted-foreground">View public glossary</div>
              </div>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 px-4 justify-start" asChild>
            <Link href="/citation-generator">
              <Settings className="h-5 w-5 mr-2 text-[#294D98]" />
              <div className="text-left">
                <div className="font-medium">Citation Tool</div>
                <div className="text-xs text-muted-foreground">Test citation generator</div>
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}