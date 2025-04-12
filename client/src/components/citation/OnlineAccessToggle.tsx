import { useFormContext } from 'react-hook-form';
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

  return (
    <FormField
      control={form.control}
      name="isOnlineSource"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm space-y-0 mt-4">
          <div className="space-y-0.5">
            <FormLabel className="text-sm font-medium text-gray-700">
              Is this {getSourceTypeDisplay()} accessed online?
            </FormLabel>
            <FormDescription className="text-xs text-gray-500">
              Select if you accessed this {getSourceTypeDisplay()} from an online source.
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value || false}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                // When turning off online access, clear the related fields
                if (!checked) {
                  form.setValue('webAddress', '');
                  form.setValue('accessDay', '');
                  form.setValue('accessMonth', '');
                  form.setValue('accessYear', '');
                  form.setValue('accessDate', '');
                }
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}