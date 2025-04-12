import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Author } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { X } from 'lucide-react';

interface AuthorInputProps {
  index: number;
  onRemove: () => void;
  namePrefix: string;
  showRemoveButton: boolean;
}

export default function AuthorInput({ index, onRemove, namePrefix, showRemoveButton }: AuthorInputProps) {
  const form = useFormContext();
  const isOrganization = form.watch(`${namePrefix}.${index}.isOrganization`);

  return (
    <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium">Author {index + 1}</h4>
        {showRemoveButton && (
          <Button
            type="button"
            onClick={onRemove}
            variant="ghost"
            size="sm"
            className="text-red-500 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
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

      {isOrganization ? (
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
  );
}