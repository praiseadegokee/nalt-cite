import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Trash2, Plus } from 'lucide-react';
import { Author } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface AuthorFieldsProps {
  namePrefix: string; // The form field prefix, e.g., "authors"
}

export default function AuthorFields({ namePrefix }: AuthorFieldsProps) {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: namePrefix,
  });

  const handleAddAuthor = () => {
    append({
      firstName: "",
      middleName: "",
      lastName: "",
      isOrganization: false,
    } as Author);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Author Information</h3>
        <Button
          type="button"
          onClick={handleAddAuthor}
          variant="outline"
          size="sm"
          className="flex items-center text-[#1B387A]"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Author
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">Author {index + 1}</h4>
            {fields.length > 1 && (
              <Button
                type="button"
                onClick={() => remove(index)}
                variant="ghost"
                size="sm"
                className="text-red-500 h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`${namePrefix}.${index}.isOrganization`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-white">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      This is an organization
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {form.watch(`${namePrefix}.${index}.isOrganization`) ? (
            <div className="mt-4">
              <FormField
                control={form.control}
                name={`${namePrefix}.${index}.lastName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Organization Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Nigerian Association of Law Teachers" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name={`${namePrefix}.${index}.firstName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Olayinka" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`${namePrefix}.${index}.middleName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Middle Name (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Adebayo" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`${namePrefix}.${index}.lastName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Oyewo" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      ))}

      {fields.length === 0 && (
        <div className="text-center p-6 border border-dashed border-gray-300 rounded-md bg-gray-50">
          <p className="text-gray-500 mb-4">No authors added yet</p>
          <Button
            type="button"
            onClick={handleAddAuthor}
            variant="outline"
            size="sm"
            className="text-[#1B387A]"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Author
          </Button>
        </div>
      )}
    </div>
  );
}