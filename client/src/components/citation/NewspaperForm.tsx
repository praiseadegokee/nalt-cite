import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import AuthorFields from './AuthorFields';

export default function NewspaperForm() {
  const form = useFormContext();
  const isOnlineSource = form.watch('isOnlineSource');

  return (
    <div className="space-y-6">
      <AuthorFields namePrefix="authors" />
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Article Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., Supreme Court Overturns Controversial Ruling" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="newspaperTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Newspaper/Magazine Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., The Guardian" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Publication Date</FormLabel>
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
      
      <FormField
        control={form.control}
        name="page"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Page Number (if applicable)</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., 5" 
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
                Is this article accessed online?
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
                    placeholder="e.g., https://guardian.ng/news/article-title" 
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
                    placeholder="e.g., 16 January 2023" 
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