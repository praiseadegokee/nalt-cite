import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';

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
  const updateCombinedField = () => {
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
  };
  
  // Initialize the combined field when the component mounts
  useEffect(() => {
    // Register all fields with default values
    form.register(dayField, { value: currentDay });
    form.register(monthField, { value: currentMonth });
    form.register(yearField, { value: currentYear });
    
    // After a short delay to allow the form to fully render, update the combined field
    const timeoutId = setTimeout(() => {
      updateCombinedField();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="space-y-4">
      <FormLabel className="text-sm font-medium text-gray-700">{label}</FormLabel>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Day Field */}
        <FormField
          control={form.control}
          name={dayField}
          defaultValue={currentDay}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Day</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || currentDay}
                  type="number"
                  min={1}
                  max={31}
                  placeholder="Day"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                  onChange={(e) => {
                    field.onChange(e);
                    updateCombinedField();
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
          defaultValue={currentMonth}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Month</FormLabel>
              <Select
                value={field.value || currentMonth}
                onValueChange={(value) => {
                  field.onChange(value);
                  updateCombinedField();
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
          defaultValue={currentYear}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Year</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || currentYear}
                  type="number"
                  min={1900}
                  max={2100}
                  placeholder="Year"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                  onChange={(e) => {
                    field.onChange(e);
                    updateCombinedField();
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