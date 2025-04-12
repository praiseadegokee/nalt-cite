import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useEffect, useCallback } from 'react';
import AccessDateFields from './AccessDateFields';

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
  const isOnlineSource = form.watch(toggleField) ?? false; // Provide default value to avoid undefined
  
  // Set default values when the component mounts
  useEffect(() => {
    // Batch update all fields that might be undefined
    const fieldsToUpdate: Record<string, any> = {};
    
    if (form.getValues(toggleField) === undefined) {
      fieldsToUpdate[toggleField] = false;
    }
    
    if (form.getValues(urlField) === undefined) {
      fieldsToUpdate[urlField] = "";
    }
    
    // Apply all updates at once to reduce rerenders
    if (Object.keys(fieldsToUpdate).length > 0) {
      Object.entries(fieldsToUpdate).forEach(([key, value]) => {
        form.setValue(key, value, { shouldValidate: false });
      });
    }
  }, [form, toggleField, urlField]);

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
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Web Address (URL)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://example.com/article"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Use Access Date Fields component */}
          <AccessDateFields fieldPrefix={accessDateField} label="Access Date" />
        </div>
      )}
    </div>
  );
}