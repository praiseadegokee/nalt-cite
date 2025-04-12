import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Generate array with 1 to 31 for days
const days = Array.from({ length: 31 }, (_, i) => i + 1);

// Array of months
const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate years (current year and 20 years back)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 21 }, (_, i) => currentYear - i);

export default function AccessDateFields() {
  const form = useFormContext();
  
  // Update the accessDate field when day, month, or year changes
  useEffect(() => {
    const updateAccessDate = () => {
      const accessDay = form.getValues('accessDay');
      const accessMonth = form.getValues('accessMonth');
      const accessYear = form.getValues('accessYear');
      
      if (accessDay && accessMonth && accessYear) {
        const formattedDate = `${accessDay} ${accessMonth} ${accessYear}`;
        form.setValue('accessDate', formattedDate);
      }
    };
    
    updateAccessDate();
    
    // Subscribe to changes
    const subscription = form.watch((value, { name }) => {
      if (name === 'accessDay' || name === 'accessMonth' || name === 'accessYear') {
        updateAccessDate();
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Get isOnlineSource value directly to ensure proper reactivity
  const isOnlineSource = form.watch('isOnlineSource');
  
  if (!isOnlineSource) return null;
  
  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Online Access Information</h3>
      
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
                  placeholder="e.g., https://www.example.com/article" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="accessDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Day Accessed</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="accessMonth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Month Accessed</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="accessYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Year Accessed</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Hidden field to store the combined date */}
        <FormField
          control={form.control}
          name="accessDate"
          render={({ field }) => (
            <input type="hidden" {...field} />
          )}
        />
      </div>
    </div>
  );
}