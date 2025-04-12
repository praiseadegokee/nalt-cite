import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OnlineSourceCheckbox } from '@/components/citation/OnlineSourceCheckbox';
import { OnlineSourceFields } from '@/components/citation/OnlineSourceFields';

interface ConferencePaperFieldsProps {
  control: any;
  watch: any;
  setValue: any;
}

export function ConferencePaperFields({ control, watch, setValue }: ConferencePaperFieldsProps) {
  const watchIsOnline = watch("isOnline");
  
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Paper Title</FormLabel>
            <FormControl>
              <Input placeholder="Title of the paper" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="proceedingsTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Proceedings Title</FormLabel>
            <FormControl>
              <Input placeholder="Title of the conference proceedings" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="conferenceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conference Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of the conference" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="conferenceLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conference Location</FormLabel>
              <FormControl>
                <Input placeholder="Where the conference was held" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="conferenceDates"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Conference Dates</FormLabel>
            <FormControl>
              <Input placeholder="Dates of the conference (e.g., '10-12 May 2024')" {...field} />
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
            <FormLabel>Page Number(s)</FormLabel>
            <FormControl>
              <Input placeholder="Page number or range (e.g., '45' or '45-52')" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Online Source Checkbox */}
      <OnlineSourceCheckbox control={control} sourceType="conferencePaper" setValue={setValue} />
      
      {/* Online Source Fields */}
      {watchIsOnline && (
        <OnlineSourceFields control={control} sourceType="conferencePaper" setValue={setValue} />
      )}
    </div>
  );
}