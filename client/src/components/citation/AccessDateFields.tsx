import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useCallback } from 'react';

interface AccessDateFieldsProps {
  fieldPrefix: string; // e.g. 'accessDate' or other field name
  label?: string;
}

const months = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export default function AccessDateFields({ fieldPrefix, label = 'Access Date' }: AccessDateFieldsProps) {
  const form = useFormContext();
  
  // Fields for day, month, and year
  const dayField = `${fieldPrefix}Day`;
  const monthField = `${fieldPrefix}Month`;
  const yearField = `${fieldPrefix}Year`;
  
  // Get the current date for default values
  const today = new Date();
  const currentDay = today.getDate().toString();
  const currentMonth = (today.getMonth() + 1).toString();
  const currentYear = today.getFullYear().toString();
  
  // When any of the fields change, update the combined field
  const updateCombinedField = useCallback(() => {
    // Get values with defaults to prevent undefined values
    const day = form.getValues(dayField) || currentDay;
    const monthNum = form.getValues(monthField) || currentMonth;
    const year = form.getValues(yearField) || currentYear;
    
    // Find the month name
    const monthName = months.find(m => m.value === monthNum)?.label || months[parseInt(monthNum) - 1]?.label;
    if (monthName) {
      // Format the date as "15 January 2023"
      const formattedDate = `${day} ${monthName} ${year}`;
      form.setValue(fieldPrefix, formattedDate, { shouldValidate: true });
    }
  }, [form, dayField, monthField, yearField, fieldPrefix, currentDay, currentMonth, currentYear]);
  
  // Initialize fields with default values when component mounts
  useEffect(() => {
    // Only set default values if fields are undefined to prevent uncontrolled->controlled warnings
    // Do this in a safer, more deterministic way without relying on timeouts
    
    let needsUpdate = false;
    const fieldsToUpdate: Record<string, string> = {};
    
    // Check day field
    if (form.getValues(dayField) === undefined) {
      fieldsToUpdate[dayField] = currentDay;
      needsUpdate = true;
    }
    
    // Check month field
    if (form.getValues(monthField) === undefined) {
      fieldsToUpdate[monthField] = currentMonth;
      needsUpdate = true;
    }
    
    // Check year field
    if (form.getValues(yearField) === undefined) {
      fieldsToUpdate[yearField] = currentYear;
      needsUpdate = true;
    }
    
    // Apply all updates at once if needed
    if (needsUpdate) {
      // Update form values first
      Object.entries(fieldsToUpdate).forEach(([key, value]) => {
        form.setValue(key, value, { shouldValidate: false });
      });
      
      // Then update the combined date field with the now-set values
      const day = form.getValues(dayField) || currentDay;
      const monthNum = form.getValues(monthField) || currentMonth;
      const year = form.getValues(yearField) || currentYear;
      
      // Find the month name
      const monthName = months.find(m => m.value === monthNum)?.label || months[parseInt(monthNum) - 1]?.label;
      
      if (monthName) {
        // Format the date as "15 January 2023"
        const formattedDate = `${day} ${monthName} ${year}`;
        console.log(`AccessDateFields: Initializing combined date field to ${formattedDate}`);
        form.setValue(fieldPrefix, formattedDate, { shouldValidate: false });
      }
    }
  }, []); // Empty dependency array to ensure this only runs once on mount

  return (
    <div className="space-y-4">
      <FormLabel className="text-sm font-medium text-gray-700">{label}</FormLabel>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Day Field */}
        <FormField
          control={form.control}
          name={dayField}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Day</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={1}
                  max={31}
                  placeholder="Day"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                  onChange={(e) => {
                    field.onChange(e);
                    setTimeout(updateCombinedField, 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Month Field */}
        <FormField
          control={form.control}
          name={monthField}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Month</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setTimeout(updateCombinedField, 0);
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Year Field */}
        <FormField
          control={form.control}
          name={yearField}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Year</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={1900}
                  max={2100}
                  placeholder="Year"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                  onChange={(e) => {
                    field.onChange(e);
                    setTimeout(updateCombinedField, 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Hidden field for the combined date value */}
      <FormField
        control={form.control}
        name={fieldPrefix}
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />
    </div>
  );
}