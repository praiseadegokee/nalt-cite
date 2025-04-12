import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';

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

interface OnlineAccessFieldsProps {
  toggleField: string; // Name of the boolean field that toggles online access, e.g., 'isOnlineSource'
  urlField: string; // Name of the URL field, e.g., 'webAddress'
  accessDateField: string; // Name of the access date field, e.g., 'accessDate'
}

export default function OnlineAccessFields({
  toggleField,
  urlField,
  accessDateField
}: OnlineAccessFieldsProps) {
  const form = useFormContext();
  const isOnlineSource = form.watch(toggleField);
  
  // Initialize fields on component mount
  useEffect(() => {
    // Make sure the URL and access date fields are registered with initial values
    // even if they're not visible yet
    if (!form.getValues(urlField)) {
      form.register(urlField, { value: "" });
    }
    
    if (!form.getValues(accessDateField)) {
      const today = new Date();
      const day = today.getDate();
      const month = months[today.getMonth()].label;
      const year = today.getFullYear();
      const formattedDate = `${day} ${month} ${year}`;
      form.register(accessDateField, { value: formattedDate });
    }
  }, []);
  
  return (
    <div className="space-y-6 mt-6 p-4 border border-gray-200 rounded-md bg-blue-50/30">
      <FormField
        control={form.control}
        name={toggleField}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-white">
            <div className="space-y-0.5">
              <FormLabel>Online Access</FormLabel>
              <div className="text-sm text-gray-500">
                Does this source have online access?
              </div>
            </div>
            <FormControl>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {isOnlineSource && (
        <div className="space-y-4 pt-4 animate-in fade-in">
          <FormField
            control={form.control}
            name={urlField}
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Web Address (URL)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="https://example.com/article"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField 
            control={form.control} 
            name={accessDateField}
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Access Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="15 January 2023"
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