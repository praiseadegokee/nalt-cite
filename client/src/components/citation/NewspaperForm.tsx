import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import AuthorFields from './AuthorFields';
import OnlineAccessFields from './OnlineAccessFields';

export default function NewspaperForm() {
  const form = useFormContext();

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
      
      {/* Online Access Fields */}
      <OnlineAccessFields 
        toggleField="isOnlineSource"
        urlField="webAddress"
        accessDateField="accessDate"
      />
    </div>
  );
}