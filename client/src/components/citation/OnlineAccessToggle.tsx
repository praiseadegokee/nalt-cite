import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface OnlineAccessToggleProps {
  sourceType: string;
}

export default function OnlineAccessToggle({ sourceType }: OnlineAccessToggleProps) {
  const form = useFormContext();
  const [isChecked, setIsChecked] = useState(false);
  
  // Initialize from form value
  useEffect(() => {
    const value = form.getValues('isOnlineSource');
    setIsChecked(!!value);
  }, [form]);

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

  const handleToggleChange = (checked: boolean) => {
    // Update local state
    setIsChecked(checked);
    
    // Update form state
    form.setValue('isOnlineSource', checked, { shouldValidate: true });
    
    // When turning off online access, clear the related fields
    if (!checked) {
      form.setValue('webAddress', '');
      form.setValue('accessDay', '');
      form.setValue('accessMonth', '');
      form.setValue('accessYear', '');
      form.setValue('accessDate', '');
    }
  };

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm mt-4">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium text-gray-700">
          Is this {getSourceTypeDisplay()} accessed online?
        </Label>
        <p className="text-xs text-gray-500">
          Select if you accessed this {getSourceTypeDisplay()} from an online source.
        </p>
      </div>
      <Switch
        id="online-access-toggle"
        checked={isChecked}
        onCheckedChange={handleToggleChange}
      />
    </div>
  );
}