import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';

interface OnlineAccessToggleProps {
  form: UseFormReturn<any>;
}

export default function OnlineAccessToggle({ form }: OnlineAccessToggleProps) {
  return (
    <FormField
      control={form.control}
      name="isOnlineSource"
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
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}