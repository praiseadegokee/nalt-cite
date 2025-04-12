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
import { ThesisFormData } from '@/lib/types';
import { OnlineSourceFields } from '../citation/OnlineSourceFields';
import { OnlineSourceCheckbox } from '../citation/OnlineSourceCheckbox';

interface ThesisFieldsProps {
  control: any;
  watch: any;
  setValue: any;
}

export function ThesisFields({ control, watch, setValue }: ThesisFieldsProps) {
  const sourceType = 'thesis';

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Thesis Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., The Implementation of International Human Rights Law in Nigeria" 
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
          name="thesisType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Type</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., PhD, LLM, etc." 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">University</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., University of Lagos" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Year</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., 2019" 
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