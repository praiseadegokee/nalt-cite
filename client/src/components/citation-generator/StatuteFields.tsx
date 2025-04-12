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
import { StatuteFormData } from '@/lib/types';
import { OnlineSourceFields } from '../citation/OnlineSourceFields';
import { OnlineSourceCheckbox } from '../citation/OnlineSourceCheckbox';

interface StatuteFieldsProps {
  control: any;
  watch: any;
  setValue: any;
}

export function StatuteFields({ control, watch, setValue }: StatuteFieldsProps) {
  const sourceType = 'statute';

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Name of Statute</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., Evidence Act" 
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
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Year</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., 2011" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="section"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Section</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., 34" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Country</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., Nigeria" 
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