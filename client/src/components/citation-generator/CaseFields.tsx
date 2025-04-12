import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CaseFormData } from '@/lib/types';
import { OnlineSourceFields } from '../citation/OnlineSourceFields';
import { OnlineSourceCheckbox } from '../citation/OnlineSourceCheckbox';

interface CaseFieldsProps {
  control: any;
  watch: any;
  setValue: any;
}

export function CaseFields({ control, watch, setValue }: CaseFieldsProps) {
  const sourceType = 'case';
  const customLawReport = watch("reporter") === "custom";

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="caseName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Case Name</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., Adesanya v President of Nigeria" 
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Year</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., 2020" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Volume</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., 2" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="reporter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Law Report</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., NWLR" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {customLawReport && (
          <FormField
            control={control}
            name="lawReportCustom"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Full Citation Format</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., (2020) 4 NWLR (Pt. 1420) 567" 
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="page"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Page</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., 123" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="court"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Court</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., Supreme Court" 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <OnlineSourceCheckbox control={control} sourceType={sourceType} setValue={setValue} />
      
      {watch("isOnlineSource") && (
        <OnlineSourceFields control={control} sourceType={sourceType} setValue={setValue} />
      )}
    </div>
  );
}