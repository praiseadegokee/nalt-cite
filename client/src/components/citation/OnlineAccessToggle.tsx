import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';

interface OnlineAccessToggleProps {
  sourceType: string;
}

export default function OnlineAccessToggle({ sourceType }: OnlineAccessToggleProps) {
  const form = useFormContext();

  // Get source type display name
  const getSourceTypeDisplay = () => {
    switch(sourceType) {
      case 'book': return 'book';
      case 'bookChapter': return 'book chapter';
      case 'journalArticle': return 'journal article';
      case 'case': return 'case';
      case 'statute': return 'statute';
      case 'conferencePaper': return 'conference paper';
      case 'newspaper': return 'newspaper';
      case 'thesis': return 'thesis';
      case 'lecture': return 'lecture';
      case 'encyclopedia': return 'encyclopedia entry';
      case 'monograph': return 'monograph';
      case 'lectureNote': return 'lecture note';
      default: return 'source';
    }
  };

  // Force register the field if it doesn't exist
  useEffect(() => {
    if (!form.getValues('isOnlineSource')) {
      form.register('isOnlineSource');
    }
  }, [form]);

  const handleToggleChange = (value: boolean) => {
    form.setValue('isOnlineSource', value, { shouldValidate: true, shouldDirty: true });
    // When turning off online access, clear the related fields
    if (!value) {
      form.setValue('webAddress', '');
      form.setValue('accessDay', '');
      form.setValue('accessMonth', '');
      form.setValue('accessYear', '');
      form.setValue('accessDate', '');
    }
  };

  const isOnline = form.watch('isOnlineSource');

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm space-y-0 mt-4">
      <div className="space-y-0.5">
        <div className="text-sm font-medium text-gray-700">
          Is this {getSourceTypeDisplay()} accessed online?
        </div>
        <div className="text-xs text-gray-500">
          Select if you accessed this {getSourceTypeDisplay()} from an online source.
        </div>
      </div>
      <Switch
        checked={!!isOnline}
        onCheckedChange={handleToggleChange}
      />
    </div>
  );
}