import React from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import { HelpCircle } from 'lucide-react';

import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface OnlineSourceCheckboxProps {
  control: Control<any>;
  sourceType: string;
  setValue: UseFormSetValue<any>;
}

export function OnlineSourceCheckbox({ control, sourceType, setValue }: OnlineSourceCheckboxProps) {
  const getToolTipText = () => {
    switch (sourceType) {
      case 'book':
        return 'Check this box if the book is available online';
      case 'journalArticle':
        return 'Check this box if the journal article is available online';
      case 'thesis':
        return 'Check this box if the thesis is available online';
      case 'conferencePaper':
        return 'Check this box if the conference paper is available online';
      case 'lecture':
        return 'Check this box if the lecture recording or transcript is available online';
      case 'encyclopedia':
        return 'Check this box if the encyclopedia entry is available online';
      case 'newspaper':
        return 'Check this box if the newspaper article is available online';
      default:
        return 'Check this box if the resource is available online';
    }
  };

  return (
    <FormField
      control={control}
      name="isOnline"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm font-medium text-gray-700">
              Online Source
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto ml-1">
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-60">{getToolTipText()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormDescription className="text-xs text-gray-500">
              This will include the web address and access date in the citation
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
}