import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Trash2, Edit, Plus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { GlossaryTerm } from '@/lib/types';

// Define glossary term form schema
const glossaryTermFormSchema = z.object({
  term: z.string().min(2, 'Term must be at least 2 characters'),
  definition: z.string().min(10, 'Definition must be at least 10 characters'),
  category: z.string().optional().default(''),
});

type GlossaryTermFormValues = z.infer<typeof glossaryTermFormSchema>;

export default function AdminGlossaryTerms() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | null>(null);
  const queryClient = useQueryClient();

  // Fetch glossary terms
  const { data: terms, isLoading } = useQuery({
    queryKey: ['/api/glossary'],
    queryFn: async () => {
      const response = await fetch('/api/glossary');
      if (!response.ok) {
        throw new Error('Failed to fetch glossary terms');
      }
      return response.json();
    },
  });

  // Form setup
  const form = useForm<GlossaryTermFormValues>({
    resolver: zodResolver(glossaryTermFormSchema),
    defaultValues: {
      term: '',
      definition: '',
      category: '',
    },
  });

  // Create glossary term mutation
  const createGlossaryTerm = useMutation({
    mutationFn: async (values: GlossaryTermFormValues) => {
      const response = await fetch('/api/glossary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create glossary term');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/glossary'] });
      toast({
        title: 'Glossary term created',
        description: 'Your glossary term has been added successfully.',
      });
      setIsOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create glossary term: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  // Update glossary term mutation
  const updateGlossaryTerm = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: GlossaryTermFormValues }) => {
      const response = await fetch(`/api/glossary/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update glossary term');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/glossary'] });
      toast({
        title: 'Glossary term updated',
        description: 'Your glossary term has been updated successfully.',
      });
      setIsOpen(false);
      setEditingTerm(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update glossary term: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  // Delete glossary term mutation
  const deleteGlossaryTerm = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/glossary/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete glossary term');
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/glossary'] });
      toast({
        title: 'Glossary term deleted',
        description: 'The glossary term has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete glossary term: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  function onSubmit(values: GlossaryTermFormValues) {
    if (editingTerm) {
      updateGlossaryTerm.mutate({ id: editingTerm.id, values });
    } else {
      createGlossaryTerm.mutate(values);
    }
  }

  // Reset form and open dialog for adding new term
  function handleAddNew() {
    form.reset({
      term: '',
      definition: '',
      category: '',
    });
    setEditingTerm(null);
    setIsOpen(true);
  }

  // Set up form for editing
  function handleEdit(term: GlossaryTerm) {
    form.reset({
      term: term.term,
      definition: term.definition,
      category: term.category || '',
    });
    setEditingTerm(term);
    setIsOpen(true);
  }

  // Handle term deletion with confirmation
  function handleDelete(id: number) {
    if (window.confirm('Are you sure you want to delete this glossary term? This action cannot be undone.')) {
      deleteGlossaryTerm.mutate(id);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B387A]">Manage Glossary Terms</h1>
        <Button
          onClick={handleAddNew}
          className="bg-[#294D98] hover:bg-[#1B387A]"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Term
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading glossary terms...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Term</TableHead>
                <TableHead>Definition</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {terms && terms.length > 0 ? (
                terms.map((term: GlossaryTerm) => (
                  <TableRow key={term.id}>
                    <TableCell className="font-medium">{term.term}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {term.definition.length > 100 
                        ? `${term.definition.substring(0, 100)}...` 
                        : term.definition}
                    </TableCell>
                    <TableCell>{term.category || 'None'}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(term)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(term.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTerm ? 'Edit Glossary Term' : 'Create New Glossary Term'}
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
                      <Input placeholder="Legal term" {...field} />
                    </FormControl>
                    <FormDescription>
                      The glossary term to define
                    </FormDescription>
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
                        placeholder="Provide a clear definition"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear explanation of the term
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setEditingTerm(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#294D98] hover:bg-[#1B387A]"
                  disabled={createGlossaryTerm.isPending || updateGlossaryTerm.isPending}
                >
                  {createGlossaryTerm.isPending || updateGlossaryTerm.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Term'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}