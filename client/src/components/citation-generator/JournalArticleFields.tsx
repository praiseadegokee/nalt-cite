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
import { JournalArticleFormData } from '@/lib/types';
import { OnlineSourceFields } from '../citation/OnlineSourceFields';
import { OnlineSourceCheckbox } from '../citation/OnlineSourceCheckbox';

interface JournalArticleFieldsProps {
  control: any;
  watch: any;
  setValue: any;
}

export function JournalArticleFields({ control, watch, setValue }: JournalArticleFieldsProps) {
  const sourceType = 'journalArticle';

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
                placeholder="e.g., The Impact of Digital Technology on Legal Education" 
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="journalName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Journal Name</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., Nigerian Journal of Legal Studies" 
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
          name="volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Volume</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., 8" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="issue"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Issue</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., 2" 
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
                  placeholder="e.g., 2021" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="startPage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Start Page</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., 45" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="endPage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">End Page</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., 68" 
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