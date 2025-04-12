import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import AuthorFields from './AuthorFields';

export default function BookChapterForm() {
  const form = useFormContext();
  const isOnlineSource = form.watch('isOnlineSource');
  const multipleEditors = form.watch('multipleEditors');

  return (
    <div className="space-y-6">
      <AuthorFields namePrefix="authors" />
      
      <FormField
        control={form.control}
        name="chapterTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Chapter Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., Federalism and Constitutional Development" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="bookTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Book Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., Nigerian Constitutional Law: Principles and Cases" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="multipleEditors"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-white">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-medium">
                Multiple Editors
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Editor Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="editorFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Editor First Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Emmanuel" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="editorMiddleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Editor Middle Name (optional)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Oluwole" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="editorLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Editor Last Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., Adebayo" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {multipleEditors && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              control={form.control}
              name="secondEditorFirstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Second Editor First Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g., Chioma" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondEditorLastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Second Editor Last Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g., Nwosu" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
      
      <FormField
        control={form.control}
        name="edition"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Edition (if applicable)</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., 2nd edn" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="publisher"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Publisher</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., University Press Limited" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Year</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., 2020" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="pageRange"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Page Range (if applicable)</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., 45-67" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="isOnlineSource"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-sm font-medium text-gray-700">Online Source</FormLabel>
              <FormDescription>
                Is this book chapter accessed online?
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {isOnlineSource && (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="webAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Web Address (URL)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., https://publisher.example.com/book/chapter" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="accessDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Access Date</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., 15 January 2023" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}