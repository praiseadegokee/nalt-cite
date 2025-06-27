import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Book, 
  Upload, 
  FileText, 
  Globe, 
  Settings,
  Users,
  LayoutDashboard,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  // Prevent access to admin in production
  if (!import.meta.env.DEV) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Admin access is not available in production.</p>
          <Link href="/">
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer mt-4 inline-block">
              Return to Home
            </span>
          </Link>
        </div>
      </div>
    );
  }

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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <CardFooter className="pt-0 flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/admin/glossary">
                Manage Glossary Terms
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/glossary/add">
                Add New Term
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* FAQ Management */}
        <Card className="hover:shadow-md transition">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#1B387A]">FAQ</CardTitle>
            <CardDescription>Manage FAQs and categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <HelpCircle className="h-5 w-5 mr-2 text-[#294D98]" />
              <span>Organize and edit frequently asked questions</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild className="w-full">
              <Link href="/admin/faq">
                Manage FAQs
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
          
          <Button variant="outline" className="h-auto py-4 px-4 justify-start" asChild>
            <Link href="/faq">
              <HelpCircle className="h-5 w-5 mr-2 text-[#294D98]" />
              <div className="text-left">
                <div className="font-medium">FAQ</div>
                <div className="text-xs text-muted-foreground">View public FAQ page</div>
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}