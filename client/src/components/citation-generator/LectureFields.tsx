import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OnlineSourceCheckbox } from '@/components/citation/OnlineSourceCheckbox';
import { OnlineSourceFields } from '@/components/citation/OnlineSourceFields';

interface LectureFieldsProps {
  control: any;
  watch: any;
  setValue: any;
}

export function LectureFields({ control, watch, setValue }: LectureFieldsProps) {
  const watchIsOnline = watch("isOnline");
  
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lecture Title</FormLabel>
            <FormControl>
              <Input placeholder="Title of the lecture" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="lectureType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lecture Type</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select lecture type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="lecture">Regular Lecture</SelectItem>
                <SelectItem value="keynote">Keynote Address</SelectItem>
                <SelectItem value="presentation">Presentation</SelectItem>
                <SelectItem value="seminar">Seminar</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="inaugural">Inaugural Lecture</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="occasion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occasion (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Event or occasion where lecture was presented" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="presentationPlace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Presentation Place</FormLabel>
              <FormControl>
                <Input placeholder="Institution or venue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="presentationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Presentation Date</FormLabel>
              <FormControl>
                <Input placeholder="Date of presentation (e.g., '15 June 2024')" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Online Source Checkbox */}
      <OnlineSourceCheckbox control={control} sourceType="lecture" setValue={setValue} />
      
      {/* Online Source Fields */}
      {watchIsOnline && (
        <OnlineSourceFields control={control} sourceType="lecture" setValue={setValue} />
      )}
    </div>
  );
}