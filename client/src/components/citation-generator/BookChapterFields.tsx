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
                    placeholder="e.g., The Value of Authorship in the Digital Environment" 
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
                    placeholder="e.g., World Wide Research: Reshaping the Sciences and Humanities in the Century of Information" 
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

        <div className="mb-4">
          <FormField
            control={control}
            name="editorFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Primary Editor First Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Clement" 
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
          
        <div className="mb-4">
          <FormField
            control={control}
            name="editorMiddleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Primary Editor Middle Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Francis" 
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
          
        <div className="mb-4">
          <FormField
            control={control}
            name="editorLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Primary Editor Last Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Kwede" 
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mb-4">
          <FormField
            control={control}
            name="secondEditorFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Second Editor First Name (if any)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Karen" 
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mb-4">
          <FormField
            control={control}
            name="secondEditorLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Second Editor Last Name (if any)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Shaakaa" 
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  If there are multiple editors, add their information here. The citation will use "(eds)" instead of "(ed)".
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
          
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
                There are multiple editors (will use "(eds)" instead of "(ed)")
              </FormLabel>
            </FormItem>
          )}
        />
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
                    placeholder="e.g., MIT" 
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
                    placeholder="e.g., 2010" 
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
                    placeholder="e.g., 62-80" 
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  Format as "62-80" or just "62" for a single page
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