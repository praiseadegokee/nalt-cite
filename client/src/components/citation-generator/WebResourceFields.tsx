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
import { WebResourceFormData } from '@/lib/types';
import { OnlineSourceFields } from '../citation/OnlineSourceFields';
import { OnlineSourceCheckbox } from '../citation/OnlineSourceCheckbox';

interface WebResourceFieldsProps {
  control: any;
  watch: any;
  setValue: any;
}

export function WebResourceFields({ control, watch, setValue }: WebResourceFieldsProps) {
  const sourceType = 'webResource';

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., Legal Implications of Fintech Innovations in Nigeria" 
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="websiteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Website Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., Nigerian Legal Forum" 
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
                  placeholder="e.g., 25 January 2022" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <OnlineSourceFields control={control} sourceType={sourceType} setValue={setValue} />
    </div>
  );
}