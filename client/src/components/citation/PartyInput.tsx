import { useFormContext } from 'react-hook-form';
import { 
  FormControl, 
  FormItem, 
  FormField,
  FormLabel 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Party } from '@/lib/types';
import { useEffect } from 'react';

const PARTY_ROLES = [
  'Plaintiff',
  'Defendant',
  'Appellant',
  'Respondent',
  'Applicant',
  'Petitioner',
  'Accused',
  'Objector',
  'Commissioner',
  'Claimant',
];

interface PartyInputProps {
  value: Party[];
  onChange: (parties: Party[]) => void;
  onBlur: () => void;
}

export default function PartyInput({ value = [], onChange, onBlur }: PartyInputProps) {
  const parties = value;
  
  const addParty = () => {
    onChange([...parties, { role: PARTY_ROLES[0], name: '' }]);
  };
  
  const removeParty = (index: number) => {
    const updatedParties = [...parties];
    updatedParties.splice(index, 1);
    onChange(updatedParties);
  };
  
  const updateParty = (index: number, field: keyof Party, value: string) => {
    const updatedParties = [...parties];
    updatedParties[index] = {
      ...updatedParties[index],
      [field]: value,
    };
    onChange(updatedParties);
  };
  
  useEffect(() => {
    // If there are no parties, add the first one automatically
    if (parties.length === 0) {
      addParty();
    }
  }, []);

  return (
    <div className="space-y-4">
      {parties.map((party, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-3 items-start">
          <div className="sm:w-1/3">
            <Select
              value={party.role}
              onValueChange={(value) => updateParty(index, 'role', value)}
              onOpenChange={onBlur}
            >
              <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {PARTY_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Input
              value={party.name}
              onChange={(e) => updateParty(index, 'name', e.target.value)}
              onBlur={onBlur}
              placeholder="Party name (e.g., University of Lagos)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
            />
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={() => removeParty(index)}
            disabled={parties.length === 1}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addParty}
        className="mt-2 text-xs"
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Party
      </Button>
      
      <div className="text-xs text-gray-500 italic mt-1">
        Note: Parties will be formatted in italics with an italicized 'v' between opposing parties
      </div>
    </div>
  );
}