import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Trash2, Edit, Plus, ArrowLeft } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { GlossaryTerm } from '@/lib/types';

// Define glossary term form schema
const glossaryTermFormSchema = z.object({
  term: z.string().min(1, 'Term is required').max(100, 'Term must be less than 100 characters'),
  definition: z.string().min(1, 'Definition is required').max(1000, 'Definition must be less than 1000 characters'),
});

type GlossaryTermFormValues = z.infer<typeof glossaryTermFormSchema>;

export default function AdminGlossary() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | null>(null);
  const queryClient = useQueryClient();

  // Fetch glossary terms
  const { data: terms = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/glossary', 'admin'],
    queryFn: async () => {
      // Add cache-busting query parameter
      const response = await fetch(`/api/glossary?_t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch glossary terms');
      }
      return response.json();
    },
    staleTime: 0, // Always consider data stale to force refresh
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  
  // Use effect to periodically refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, [refetch]);

  // Form setup
  const form = useForm<GlossaryTermFormValues>({
    resolver: zodResolver(glossaryTermFormSchema),
    defaultValues: {
      term: '',
      definition: '',
    },
  });

  // Create mutation
  const createGlossaryTerm = useMutation({
    mutationFn: async (data: GlossaryTermFormValues) => {
      const response = await fetch('/api/glossary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create glossary term');
      }
      
      return response.json();
    },
    onSuccess: (newTerm) => {
      // Invalidate and refresh all glossary queries
      queryClient.invalidateQueries();
      queryClient.refetchQueries({ queryKey: ['/api/glossary'] });
      
      // Also manually update the cache to ensure immediate update
      queryClient.setQueryData(['/api/glossary', 'admin'], (oldData: any) => {
        return oldData ? [...oldData, newTerm] : [newTerm];
      });
      
      // Update the regular glossary page cache too
      queryClient.setQueryData(['/api/glossary'], (oldData: any) => {
        return oldData ? [...oldData, newTerm] : [newTerm];
      });
      
      toast({
        title: 'Success',
        description: 'Glossary term has been added',
      });
      setIsOpen(false);
      
      // Manually trigger refetch after a short delay
      setTimeout(() => {
        refetch();
      }, 500);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add glossary term',
        variant: 'destructive',
      });
    },
  });
  
  // Update mutation
  const updateGlossaryTerm = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: GlossaryTermFormValues }) => {
      const response = await fetch(`/api/glossary/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update glossary term');
      }
      
      return response.json();
    },
    onSuccess: (updatedTerm) => {
      // Invalidate and refresh all glossary queries
      queryClient.invalidateQueries();
      queryClient.refetchQueries({ queryKey: ['/api/glossary'] });
      
      // Also manually update the cache to ensure immediate update
      queryClient.setQueryData(['/api/glossary', 'admin'], (oldData: any) => {
        if (!oldData) return [updatedTerm];
        return oldData.map((term: GlossaryTerm) => 
          term.id === updatedTerm.id ? updatedTerm : term
        );
      });
      
      // Update the regular glossary page cache too
      queryClient.setQueryData(['/api/glossary'], (oldData: any) => {
        if (!oldData) return [updatedTerm];
        return oldData.map((term: GlossaryTerm) => 
          term.id === updatedTerm.id ? updatedTerm : term
        );
      });
      
      toast({
        title: 'Success',
        description: 'Glossary term has been updated',
      });
      setIsOpen(false);
      
      // Manually trigger refetch after a short delay
      setTimeout(() => {
        refetch();
      }, 500);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update glossary term',
        variant: 'destructive',
      });
    },
  });
  
  // Delete mutation
  const deleteGlossaryTerm = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/glossary/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete glossary term');
      }
      
      return true;
    },
    onSuccess: (_data, deletedId) => {
      // Invalidate and refresh all glossary queries
      queryClient.invalidateQueries();
      queryClient.refetchQueries({ queryKey: ['/api/glossary'] });
      
      // Also manually update the cache to ensure immediate update
      queryClient.setQueryData(['/api/glossary', 'admin'], (oldData: any) => {
        if (!oldData) return [];
        return oldData.filter((term: GlossaryTerm) => term.id !== deletedId);
      });
      
      // Update the regular glossary page cache too
      queryClient.setQueryData(['/api/glossary'], (oldData: any) => {
        if (!oldData) return [];
        return oldData.filter((term: GlossaryTerm) => term.id !== deletedId);
      });
      
      toast({
        title: 'Success',
        description: 'Glossary term has been deleted',
      });
      
      // Manually trigger refetch after a short delay
      setTimeout(() => {
        refetch();
      }, 500);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete glossary term',
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  function onSubmit(data: GlossaryTermFormValues) {
    if (editingTerm) {
      updateGlossaryTerm.mutate({ id: editingTerm.id!, data });
    } else {
      createGlossaryTerm.mutate(data);
    }
  }

  // Reset form and open dialog
  function handleAddNew() {
    form.reset({
      term: '',
      definition: '',
    });
    setEditingTerm(null);
    setIsOpen(true);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Link href="/admin">
              <Button variant="ghost" className="flex items-center mr-2 p-0">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back</span>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-[#1B387A]">Manage Glossary Terms</h1>
          </div>
          <p className="text-gray-600">Add, edit, or remove legal citation terminology</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-[#294D98] hover:bg-[#1B387A]"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Term
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-[#294D98] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading glossary terms...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Term</TableHead>
                <TableHead>Definition</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {terms.length > 0 ? (
                terms.map((term: GlossaryTerm) => (
                  <TableRow key={term.id}>
                    <TableCell className="font-medium">{term.term}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {term.definition.length > 100 ? term.definition.substring(0, 100) + '...' : term.definition}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setEditingTerm(term);
                            form.reset({
                              term: term.term,
                              definition: term.definition,
                            });
                            setIsOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the term "${term.term}"?`)) {
                              deleteGlossaryTerm.mutate(term.id!);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No glossary terms yet. Click "Add New Term" to create your first glossary term.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Glossary Term Form Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTerm ? 'Edit Glossary Term' : 'Add New Glossary Term'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the term" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="definition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Definition</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the definition"
                        className="h-32"
                        {...field}
                      />
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
                  disabled={createGlossaryTerm.isPending || updateGlossaryTerm.isPending}
                >
                  {createGlossaryTerm.isPending || updateGlossaryTerm.isPending
                    ? 'Saving...'
                    : editingTerm
                      ? 'Update Term'
                      : 'Save Term'
                  }
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}