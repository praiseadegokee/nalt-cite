import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Trash2, Edit, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { BlogPost } from '@/lib/types';

// Define blog post form schema
const blogPostFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  date: z.string(),
  author: z.string().min(2, 'Author name is required'),
  readTime: z.number().min(1, 'Read time must be at least 1 minute'),
  category: z.string().min(2, 'Category is required'),
  tags: z.string().optional().transform(value => {
    if (!value) return "";
    return value;
  }),
  thumbnail: z.string().optional(),
});

type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

export default function AdminBlogPosts() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const queryClient = useQueryClient();

  // Fetch blog posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/blog/posts'],
    queryFn: async () => {
      const response = await fetch('/api/blog/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      return response.json();
    },
  });

  // Form setup
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      author: '',
      readTime: 5,
      category: '',
      tags: '',
      thumbnail: '',
    },
  });

  // Handle thumbnail file selection
  const handleThumbnailChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Thumbnail must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Only JPEG, PNG, WebP, and GIF images are allowed',
        variant: 'destructive',
      });
      return;
    }

    setThumbnailFile(file);
    setUploadingThumbnail(true);

    try {
      const formData = new FormData();
      formData.append('thumbnail', file);

      const response = await fetch('/api/blog/upload-thumbnail', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setThumbnailUrl(result.thumbnailUrl);
        form.setValue('thumbnail', result.thumbnailUrl);
        toast({
          title: 'Thumbnail uploaded',
          description: 'Your thumbnail has been uploaded successfully',
        });
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      setThumbnailFile(null);
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Create/Update blog post mutation
  const createBlogPost = useMutation({
    mutationFn: async (values: BlogPostFormValues) => {
      // Parse tags from comma-separated string to array before sending
      const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
      
      const url = editingPost ? `/api/blog/posts/${editingPost.id}` : '/api/blog/posts';
      const method = editingPost ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          tags: tagsArray,
          thumbnail: values.thumbnail || null
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${editingPost ? 'update' : 'create'} blog post`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: `Blog post ${editingPost ? 'updated' : 'created'}`,
        description: `Your blog post has been ${editingPost ? 'updated' : 'published'} successfully.`,
      });
      setIsOpen(false);
      setEditingPost(null);
      setThumbnailFile(null);
      setThumbnailUrl('');
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to ${editingPost ? 'update' : 'create'} blog post: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  function onSubmit(values: BlogPostFormValues) {
    createBlogPost.mutate(values);
  }

  // Reset form and open dialog
  function handleAddNew() {
    form.reset({
      title: '',
      excerpt: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      author: '',
      readTime: 5,
      category: '',
      tags: '',
      thumbnail: '',
    });
    setEditingPost(null);
    setThumbnailFile(null);
    setThumbnailUrl('');
    setIsOpen(true);
  }

  // Handle editing existing post
  function handleEditPost(post: BlogPost) {
    // Handle tags parsing safely
    let tagsString = '';
    if (post.tags) {
      if (Array.isArray(post.tags)) {
        tagsString = post.tags.join(', ');
      } else if (typeof post.tags === 'string') {
        try {
          // Try to parse as JSON array first
          const parsed = JSON.parse(post.tags);
          if (Array.isArray(parsed)) {
            tagsString = parsed.join(', ');
          } else {
            tagsString = post.tags;
          }
        } catch {
          // If not JSON, treat as plain string
          tagsString = post.tags;
        }
      }
    }
    
    form.reset({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      author: post.author,
      readTime: post.readTime,
      category: post.category,
      tags: tagsString,
      thumbnail: (post as any).thumbnail || '',
    });
    
    setEditingPost(post);
    setThumbnailUrl((post as any).thumbnail || '');
    setThumbnailFile(null);
    setIsOpen(true);
  }

  // Format the tags for display
  function formatTags(tagsString: string | null) {
    if (!tagsString) return 'None';
    try {
      const tags = JSON.parse(tagsString);
      return Array.isArray(tags) ? tags.join(', ') : tagsString;
    } catch (e) {
      return tagsString;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B387A]">Manage Blog Posts</h1>
        <Button
          onClick={handleAddNew}
          className="bg-[#294D98] hover:bg-[#1B387A]"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading blog posts...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts && posts.length > 0 ? (
                posts.map((post: BlogPost) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      {new Date(post.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditPost(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => {
                          // Set up delete functionality here
                          console.log('Delete post', post.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No blog posts yet. Click "Add New Post" to create your first blog post.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Blog Post Form Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Blog post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Thumbnail Upload Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Thumbnail Image (Optional)
                </label>
                <div className="space-y-3">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleThumbnailChange}
                    disabled={uploadingThumbnail}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Upload a thumbnail image (JPEG, PNG, WebP, GIF). Maximum file size: 5MB. Recommended dimensions: 1280x720px.
                  </p>
                  {uploadingThumbnail && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Uploading thumbnail...
                    </div>
                  )}
                  {thumbnailUrl && (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600">Thumbnail uploaded successfully!</p>
                      <img
                        src={thumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-32 h-18 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short summary of the blog post"
                        className="h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (HTML)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Blog post content in HTML format"
                        className="h-40"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publish Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Citation Tips" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="readTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Read Time (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. citation, tips, legal writing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#294D98] hover:bg-[#1B387A]"
                  disabled={createBlogPost.isPending}
                >
                  {createBlogPost.isPending ? 'Saving...' : 'Save Blog Post'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}