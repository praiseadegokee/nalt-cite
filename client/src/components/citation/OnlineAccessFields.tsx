import React from 'react';
import { FormField } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import OnlineAccessToggle from './OnlineAccessToggle';
import AccessDateFields from './AccessDateFields';

interface OnlineAccessFieldsProps {
  form: UseFormReturn<any>;
}

export default function OnlineAccessFields({ form }: OnlineAccessFieldsProps) {
  const isOnline = form.watch('isOnlineSource');

  return (
    <div className="space-y-4">
      <OnlineAccessToggle form={form} />
      {isOnline && (
        <div className="space-y-4">
          <FormField
            name="webAddress"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <label htmlFor={field.name} className="text-sm font-medium">Web Address</label>
                <input
                  {...field}
                  type="url"
                  className="border rounded-md p-2"
                  placeholder="https://example.com"
                />
              </div>
            )}
          />
          <AccessDateFields form={form} />
        </div>
      )}
    </div>
  );
}