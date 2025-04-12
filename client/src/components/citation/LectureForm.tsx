import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import AuthorFields from './AuthorFields';
import OnlineAccessFields from './OnlineAccessFields';

export default function LectureForm() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <AuthorFields namePrefix="authors" />
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Lecture Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., The Future of Law in Nigeria's Digital Age" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="lectureType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Lecture Type</FormLabel>
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]">
                  <SelectValue placeholder="Select lecture type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inaugural Lecture">Inaugural Lecture</SelectItem>
                  <SelectItem value="Distinguished Lecture">Distinguished Lecture</SelectItem>
                  <SelectItem value="Keynote Address">Keynote Address</SelectItem>
                  <SelectItem value="Memorial Lecture">Memorial Lecture</SelectItem>
                  <SelectItem value="Annual Lecture">Annual Lecture</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="institution"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Institution/Organization</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., Nigerian Institute of Advanced Legal Studies" 
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
            <FormLabel className="text-sm font-medium text-gray-700">Date</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., 10 June 2023" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Location (if applicable)</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., Sheraton Hotel, Lagos" 
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