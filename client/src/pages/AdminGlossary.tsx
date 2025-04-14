import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Loader2,
  BookOpen,
  X,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { GlossaryTerm } from '@shared/schema';

export default function AdminGlossary() {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [termToEdit, setTermToEdit] = useState<GlossaryTerm | null>(null);
  const [termToDelete, setTermToDelete] = useState<GlossaryTerm | null>(null);
  const [editFormData, setEditFormData] = useState({
    term: '',
    definition: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch glossary terms
  const {
    data: terms = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['/api/glossary'],
    queryFn: async () => {
      const response = await fetch('/api/glossary');
      if (!response.ok) {
        throw new Error('Failed to fetch glossary terms');
      }
      return response.json() as Promise<GlossaryTerm[]>;
    },
  });

  // Filtered and sorted terms based on search input
  const filteredTerms = terms
    .filter(
      (term: GlossaryTerm) =>
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: GlossaryTerm, b: GlossaryTerm) => a.term.localeCompare(b.term));

  // Delete term mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/glossary/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete glossary term');
      }
      
      return id;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/glossary'] });
      toast({
        title: 'Term deleted',
        description: 'The glossary term has been successfully deleted.',
      });
      setIsDeleteDialogOpen(false);
      setTermToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete term. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update term mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { term: string; definition: string };
    }) => {
      setFormError(null);

      if (!data.term || !data.definition) {
        throw new Error('Term name and definition are required');
      }

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
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/glossary'] });
      toast({
        title: 'Term updated',
        description: 'The glossary term has been successfully updated.',
      });
      setIsEditDialogOpen(false);
      setTermToEdit(null);
    },
    onError: (error: Error) => {
      setFormError(error.message || 'Failed to update term. Please try again.');
      toast({
        title: 'Error',
        description: error.message || 'Failed to update term. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleDeleteClick = (term: GlossaryTerm) => {
    setTermToDelete(term);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (termToDelete) {
      deleteMutation.mutate(termToDelete.id);
    }
  };

  const handleEditClick = (term: GlossaryTerm) => {
    setFormError(null);
    setTermToEdit(term);
    setEditFormData({
      term: term.term,
      definition: term.definition,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (termToEdit) {
      updateMutation.mutate({
        id: termToEdit.id,
        data: editFormData,
      });
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex justify-between items-center mb-6"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          variant="ghost"
          className="text-[#294D98] flex items-center"
          onClick={() => setLocation('/admin')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Button>
        <Button
          onClick={() => setLocation('/admin/glossary/add')}
          className="bg-[#294D98] hover:bg-[#1B387A]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Term
        </Button>
      </motion.div>

      <motion.div 
        className="bg-white rounded-lg shadow p-6"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center mb-6">
          <BookOpen className="h-6 w-6 text-[#294D98] mr-2" />
          <h1 className="text-2xl font-bold text-[#1B387A]">Manage Glossary Terms</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button 
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Count Display */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} 
            {searchTerm ? ` matching "${searchTerm}"` : ''}
          </div>
        </div>

        {/* Terms Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin mr-2 h-6 w-6 text-[#294D98]" />
            <span>Loading glossary terms...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <Alert variant="destructive" className="max-w-md mx-auto mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Failed to load glossary terms</AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        ) : filteredTerms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No glossary terms found. {searchTerm && 'Try a different search term or '} 
            <Button variant="link" onClick={() => setLocation('/admin/glossary/add')} className="text-[#294D98] p-0">
              add a new term
            </Button>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Term</TableHead>
                  <TableHead>Definition</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTerms.map((term: GlossaryTerm) => (
                  <TableRow key={term.id}>
                    <TableCell className="font-medium">{term.term}</TableCell>
                    <TableCell className="truncate max-w-[400px]">
                      {term.definition.length > 100
                        ? `${term.definition.substring(0, 100)}...`
                        : term.definition}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(term)}
                          title="Edit term"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(term)}
                          title="Delete term"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Glossary Term</DialogTitle>
            <DialogDescription>
              Confirm deletion of the selected glossary term.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete the term "<strong>{termToDelete?.term}</strong>"? 
            This action cannot be undone.
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="ml-2"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Term Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Glossary Term</DialogTitle>
            <DialogDescription>
              Update the term's name and definition.
            </DialogDescription>
          </DialogHeader>
          
          {formError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="term">Term</Label>
              <Input
                id="term"
                value={editFormData.term}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, term: e.target.value })
                }
                placeholder="Enter term name"
              />
              {!editFormData.term && <p className="text-sm text-red-500">Term is required</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="definition">Definition</Label>
              <Textarea
                id="definition"
                value={editFormData.definition}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, definition: e.target.value })
                }
                placeholder="Enter definition"
                rows={5}
              />
              {!editFormData.definition && <p className="text-sm text-red-500">Definition is required</p>}
            </div>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEdit}
              disabled={updateMutation.isPending || !editFormData.term || !editFormData.definition}
              className="ml-2 bg-[#294D98] hover:bg-[#1B387A]"
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}