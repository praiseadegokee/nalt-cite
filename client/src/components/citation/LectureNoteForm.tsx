import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import AuthorFields from './AuthorFields';

export default function LectureNoteForm() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <AuthorFields namePrefix="authors" />
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Lecture Note Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., Introduction to Nigerian Constitutional Law" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="course"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Course/Faculty</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., Faculty of Law, University of Lagos" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormDescription>
              The course or faculty for which the lecture note was prepared
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="audience"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Intended Audience (optional)</FormLabel>
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="graduate students">Graduate Students</SelectItem>
                  <SelectItem value="undergraduate students">Undergraduate Students</SelectItem>
                  <SelectItem value="final year undergraduate students">Final Year Undergraduate Students</SelectItem>
                  <SelectItem value="postgraduate students">Postgraduate Students</SelectItem>
                  <SelectItem value="law students">Law Students</SelectItem>
                  <SelectItem value="legal practitioners">Legal Practitioners</SelectItem>
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
            <FormLabel className="text-sm font-medium text-gray-700">Institution</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., University of Lagos" 
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
            <FormLabel className="text-sm font-medium text-gray-700">Date Prepared</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., May 2023" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="additionalInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Additional Information (optional)</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="e.g., Unpublished lecture note presented during the 2023 First Semester" 
                className="w-full min-h-[80px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormDescription>
              Any other relevant details about the lecture note
            </FormDescription>
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
                placeholder="e.g., 12" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}