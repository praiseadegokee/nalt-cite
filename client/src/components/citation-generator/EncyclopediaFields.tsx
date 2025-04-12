import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OnlineSourceCheckbox } from '@/components/citation/OnlineSourceCheckbox';
import { OnlineSourceFields } from '@/components/citation/OnlineSourceFields';

interface EncyclopediaFieldsProps {
  control: any;
  watch: any;
  setValue: any;
}

export function EncyclopediaFields({ control, watch, setValue }: EncyclopediaFieldsProps) {
  const watchIsOnline = watch("isOnline");
  
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entry Title</FormLabel>
            <FormControl>
              <Input placeholder="Title of the specific entry" {...field} />
            </FormControl>
            <FormDescription>
              The title of the specific entry in Halsbury's Laws of England
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="edition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edition</FormLabel>
              <FormControl>
                <Input placeholder="e.g., '5th edn'" {...field} />
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
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input placeholder="Year of publication" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volume</FormLabel>
              <FormControl>
                <Input placeholder="Volume number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="paragraph"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paragraph Number</FormLabel>
              <FormControl>
                <Input placeholder="Paragraph number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Online Source Checkbox */}
      <OnlineSourceCheckbox control={control} sourceType="encyclopedia" setValue={setValue} />
      
      {/* Online Source Fields */}
      {watchIsOnline && (
        <OnlineSourceFields control={control} sourceType="encyclopedia" setValue={setValue} />
      )}
    </div>
  );
}