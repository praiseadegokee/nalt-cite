import React, { useEffect } from 'react';
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
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BookChapterFieldsProps {
  control: any;
  watch: any;
  setValue: any;
}

export function BookChapterFields({ control, watch, setValue }: BookChapterFieldsProps) {
  const isOnlineSource = watch('isOnlineSource');
  const secondEditorFirstName = watch('secondEditorFirstName');
  const secondEditorLastName = watch('secondEditorLastName');
  
  // Auto-set multipleEditors flag when second editor info is provided
  useEffect(() => {
    if ((secondEditorFirstName && secondEditorFirstName.trim() !== '') || 
        (secondEditorLastName && secondEditorLastName.trim() !== '')) {
      setValue('multipleEditors', true);
    }
  }, [secondEditorFirstName, secondEditorLastName, setValue]);
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Chapter Information
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Enter the title of the chapter. The chapter title will be enclosed in single quotes in the citation.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        
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
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Will be enclosed in single quotes in the citation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Book Information
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Enter the title of the book containing the chapter. The book title will be italicized in the citation.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        
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
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Will be automatically italicized in the citation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Editor Information
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Enter the editor(s) of the book. The word "in" will be automatically added before the editor names. Adding a second editor will automatically use "(eds)" instead of "(ed)".</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>

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
                    value={field.value || ''}
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
                <FormLabel className="text-sm font-medium text-gray-700">Primary Editor Middle Name (if any)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Francis" 
                    className="w-full"
                    value={field.value || ''}
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
                    value={field.value || ''}
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
                    value={field.value || ''}
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
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Adding a second editor will automatically use "(eds)" in the citation
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
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Other multiple editors (will use "(eds)" instead of "(ed)")
              </FormLabel>
            </FormItem>
          )}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Publication Information
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Enter the publisher and year of publication. These will appear in parentheses in the citation.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        
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
                    value={field.value || ''}
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
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Additional Information
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Add edition details and page range. For chapters, the page range is a required element.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        
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
                    value={field.value || ''}
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
                    value={field.value || ''}
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
                    checked={field.value || false}
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
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Will be enclosed in angle brackets &lt;URL&gt; in the citation
                    </FormDescription>
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
                        value={field.value || ''}
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