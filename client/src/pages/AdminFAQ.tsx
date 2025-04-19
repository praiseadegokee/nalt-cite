import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';
import { FAQ as FAQItem, FaqCategory } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';

export default function AdminFAQ() {
  const [activeTab, setActiveTab] = useState('categories');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State for forms
  const [categoryForm, setCategoryForm] = useState<{
    id: number;
    name: string;
    description: string | null;
    order: number;
  }>({
    id: 0,
    name: '',
    description: null,
    order: 0
  });
  
  const [faqItemForm, setFaqItemForm] = useState({
    id: 0,
    question: '',
    answer: '',
    categoryId: 0,
    order: 0
  });

  // State for tracking edit mode
  const [editingCategory, setEditingCategory] = useState(false);
  const [editingFaqItem, setEditingFaqItem] = useState(false);

  // Fetch FAQ categories
  const { 
    data: categories = [],
    isLoading: categoriesLoading
  } = useQuery<FaqCategory[]>({
    queryKey: ['/api/faq/categories'],
    retry: 1,
  });

  // Fetch FAQ items
  const { 
    data: faqItems = [],
    isLoading: faqItemsLoading
  } = useQuery<FAQItem[]>({
    queryKey: ['/api/faq/items'],
    retry: 1,
  });

  // Category Mutations
  const createCategory = useMutation({
    mutationFn: (newCategory: Omit<FaqCategory, 'id'>) => {
      return apiRequest('/api/faq/categories', {
        method: 'POST',
        body: JSON.stringify(newCategory),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/faq/categories'] });
      resetCategoryForm();
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  const updateCategory = useMutation({
    mutationFn: (updatedCategory: FaqCategory) => {
      return apiRequest(`/api/faq/categories/${updatedCategory.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedCategory),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/faq/categories'] });
      resetCategoryForm();
      setEditingCategory(false);
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: number) => {
      return apiRequest(`/api/faq/categories/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/faq/categories'] });
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete category. Make sure it has no associated FAQ items.',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  // FAQ Item Mutations
  const createFaqItem = useMutation({
    mutationFn: (newItem: Omit<FAQItem, 'id'>) => {
      return apiRequest('/api/faq/items', {
        method: 'POST',
        body: JSON.stringify(newItem),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/faq/items'] });
      resetFaqItemForm();
      toast({
        title: 'Success',
        description: 'FAQ item created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create FAQ item',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  const updateFaqItem = useMutation({
    mutationFn: (updatedItem: FAQItem) => {
      return apiRequest(`/api/faq/items/${updatedItem.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedItem),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/faq/items'] });
      resetFaqItemForm();
      setEditingFaqItem(false);
      toast({
        title: 'Success',
        description: 'FAQ item updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update FAQ item',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  const deleteFaqItem = useMutation({
    mutationFn: (id: number) => {
      return apiRequest(`/api/faq/items/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/faq/items'] });
      toast({
        title: 'Success',
        description: 'FAQ item deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete FAQ item',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  // Form handlers
  const handleCategoryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryForm({
      ...categoryForm,
      [name]: name === 'order' ? parseInt(value) || 0 : value,
    });
  };

  const handleFaqItemFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFaqItemForm({
      ...faqItemForm,
      [name]: name === 'order' || name === 'categoryId' ? parseInt(value) || 0 : value,
    });
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required',
        variant: 'destructive',
      });
      return;
    }

    if (editingCategory) {
      updateCategory.mutate(categoryForm as FaqCategory);
    } else {
      const { id, ...newCategory } = categoryForm;
      createCategory.mutate(newCategory);
    }
  };

  const handleFaqItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqItemForm.question || !faqItemForm.answer || !faqItemForm.categoryId) {
      toast({
        title: 'Validation Error',
        description: 'Question, answer, and category are required',
        variant: 'destructive',
      });
      return;
    }

    if (editingFaqItem) {
      updateFaqItem.mutate(faqItemForm as FAQItem);
    } else {
      const { id, ...newItem } = faqItemForm;
      createFaqItem.mutate(newItem);
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      id: 0,
      name: '',
      description: null,
      order: 0
    });
    setEditingCategory(false);
  };

  const resetFaqItemForm = () => {
    setFaqItemForm({
      id: 0,
      question: '',
      answer: '',
      categoryId: categories.length > 0 ? categories[0].id : 0,
      order: 0
    });
    setEditingFaqItem(false);
  };

  const editCategory = (category: FaqCategory) => {
    setCategoryForm(category);
    setEditingCategory(true);
  };

  const editFaqItem = (item: FAQItem) => {
    setFaqItemForm(item);
    setEditingFaqItem(true);
  };

  const confirmDeleteCategory = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      deleteCategory.mutate(id);
    }
  };

  const confirmDeleteFaqItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this FAQ item? This action cannot be undone.')) {
      deleteFaqItem.mutate(id);
    }
  };

  // Loading state
  if (categoriesLoading || faqItemsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">FAQ Administration</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">FAQ Administration</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="categories">Manage Categories</TabsTrigger>
          <TabsTrigger value="faq-items">Manage FAQ Items</TabsTrigger>
        </TabsList>
        
        {/* Categories Tab */}
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Category Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={categoryForm.name} 
                      onChange={handleCategoryFormChange} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={categoryForm.description || ''} 
                      onChange={handleCategoryFormChange} 
                      rows={3} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="order">Display Order</Label>
                    <Input 
                      id="order" 
                      name="order" 
                      type="number" 
                      value={categoryForm.order} 
                      onChange={handleCategoryFormChange} 
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      {editingCategory ? 'Update Category' : 'Add Category'}
                    </Button>
                    {editingCategory && (
                      <Button type="button" variant="outline" onClick={resetCategoryForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* List */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">No categories found. Add your first category.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.description || '-'}</TableCell>
                          <TableCell>{category.order}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => editCategory(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => confirmDeleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* FAQ Items Tab */}
        <TabsContent value="faq-items">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>{editingFaqItem ? 'Edit FAQ Item' : 'Add New FAQ Item'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFaqItemSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question *</Label>
                    <Input 
                      id="question" 
                      name="question" 
                      value={faqItemForm.question} 
                      onChange={handleFaqItemFormChange} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="answer">Answer *</Label>
                    <Textarea 
                      id="answer" 
                      name="answer" 
                      value={faqItemForm.answer} 
                      onChange={handleFaqItemFormChange} 
                      rows={5} 
                      required 
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      You can use HTML tags (e.g., &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;) for formatting.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="categoryId">Category *</Label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={faqItemForm.categoryId}
                      onChange={handleFaqItemFormChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="order">Display Order</Label>
                    <Input 
                      id="order" 
                      name="order" 
                      type="number" 
                      value={faqItemForm.order} 
                      onChange={handleFaqItemFormChange} 
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      {editingFaqItem ? 'Update FAQ Item' : 'Add FAQ Item'}
                    </Button>
                    {editingFaqItem && (
                      <Button type="button" variant="outline" onClick={resetFaqItemForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* List */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>FAQ Items</CardTitle>
              </CardHeader>
              <CardContent>
                {faqItems.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">No FAQ items found. Add your first item.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faqItems.map((item) => {
                        const category = categories.find(c => c.id === item.categoryId);
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="link" className="p-0 h-auto font-medium text-left">
                                    {item.question.length > 60 ? `${item.question.slice(0, 60)}...` : item.question}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <div className="space-y-2">
                                    <h4 className="font-medium">{item.question}</h4>
                                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: item.answer }} />
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                            <TableCell>{category?.name || '-'}</TableCell>
                            <TableCell>{item.order}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => editFaqItem(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => confirmDeleteFaqItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}