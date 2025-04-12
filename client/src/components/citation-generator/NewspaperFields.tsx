import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NewspaperFormData } from '@/lib/types';
import { OnlineSourceFields } from '../citation/OnlineSourceFields';
import { OnlineSourceCheckbox } from '../citation/OnlineSourceCheckbox';

interface NewspaperFieldsProps {
  control: any;
  watch: any;
  setValue: any;
}

export function NewspaperFields({ control, watch, setValue }: NewspaperFieldsProps) {
  const sourceType = 'newspaper';

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Article Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., Supreme Court Ruling on Electoral Disputes" 
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="newspaperName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Newspaper Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., The Guardian" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="publicationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Publication Date</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., 12 March 2023" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="page"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Page</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., 4" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <OnlineSourceCheckbox control={control} sourceType={sourceType} setValue={setValue} />
      
      {watch("isOnlineSource") && (
        <OnlineSourceFields control={control} sourceType={sourceType} setValue={setValue} />
      )}
    </div>
  );
}