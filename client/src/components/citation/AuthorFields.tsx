import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { Author } from '@/lib/types';
import { Button } from '@/components/ui/button';
import AuthorInput from './AuthorInput';

interface AuthorFieldsProps {
  namePrefix: string; // The form field prefix, e.g., "authors"
}

export default function AuthorFields({ namePrefix }: AuthorFieldsProps) {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: namePrefix,
  });

  const handleAddAuthor = () => {
    append({
      firstName: "",
      middleName: "",
      lastName: "",
      isOrganization: false,
    } as Author);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Author Information</h3>
        <Button
          type="button"
          onClick={handleAddAuthor}
          variant="outline"
          size="sm"
          className="flex items-center text-[#1B387A]"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Author
        </Button>
      </div>

      {fields.map((field, index) => (
        <AuthorInput 
          key={field.id}
          index={index}
          onRemove={() => remove(index)}
          namePrefix={namePrefix}
          showRemoveButton={fields.length > 1}
        />
      ))}

      {fields.length === 0 && (
        <div className="text-center p-6 border border-dashed border-gray-300 rounded-md bg-gray-50">
          <p className="text-gray-500 mb-4">No authors added yet</p>
          <Button
            type="button"
            onClick={handleAddAuthor}
            variant="outline"
            size="sm"
            className="text-[#1B387A]"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Author
          </Button>
        </div>
      )}
    </div>
  );
}