import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface BookChapterFieldsProps {
  control: any;
  watch: any;
  setValue: any;
}

export function BookChapterFields({ control, watch, setValue }: BookChapterFieldsProps) {
  const isOnlineSource = watch('isOnlineSource');
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-4">Chapter Information</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={control}
            name="chapterTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Chapter Title</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., The Impact of Legal Literature" 
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-4">Book Information</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={control}
            name="bookTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Book Title</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Nigerian Legal System" 
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-4">Editor Information</h3>
        
        <FormField
          control={control}
          name="multipleEditors"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 mb-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Multiple editors (more than one)
              </FormLabel>
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="editorFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Editor First Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Oluwakemi" 
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="editorMiddleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Editor Middle Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Adebayo" 
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="editorLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Editor Last Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Ogunleye" 
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-4">Publication Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="publisher"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Publisher</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Nigerian Law Publications" 
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
                    placeholder="e.g., 2023" 
                    className="w-full"
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-4">Additional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="edition"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Edition</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., 2nd edn" 
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  Format as "2nd edn" or "Revised edn"
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="pageRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Page Range</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., 120-135" 
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  Format as "120-135" or "p 120"
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-4">
          <FormField
            control={control}
            name="isOnlineSource"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 mb-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  This is an online source
                </FormLabel>
              </FormItem>
            )}
          />
          
          {isOnlineSource && (
            <div className="grid grid-cols-1 gap-4 mt-3">
              <FormField
                control={control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Website URL</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., https://example.com/book-chapter" 
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name="accessDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Date Accessed</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., 23 April 2023" 
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      Format as "23 April 2023"
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}