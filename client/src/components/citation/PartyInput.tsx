import { useFormContext } from 'react-hook-form';
import { 
  FormControl, 
  FormItem, 
  FormField,
  FormLabel,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Party } from '@/lib/types';
import { useEffect, useCallback, useState } from 'react';

// Pre-defined party pairings
const CASE_TYPES = {
  APPEAL: 'appeal',
  CIVIL: 'civil',
  CRIMINAL: 'criminal'
};

interface PartyInputProps {
  value: Party[];
  onChange: (parties: Party[]) => void;
  onBlur: () => void;
}

export default function PartyInput({ value = [], onChange, onBlur }: PartyInputProps) {
  // Ensure parties is never undefined to prevent controlled/uncontrolled component warnings
  const parties = Array.isArray(value) ? value : [];
  const [activeTab, setActiveTab] = useState(CASE_TYPES.APPEAL);
  
  // Set up party pair based on the selected case type
  const setupPartyPair = useCallback((caseType: string) => {
    let partyPair: Party[] = [];
    
    switch (caseType) {
      case CASE_TYPES.APPEAL:
        partyPair = [
          { role: 'Appellant', name: '' },
          { role: 'Respondent', name: '' }
        ];
        break;
      case CASE_TYPES.CIVIL:
        partyPair = [
          { role: 'Plaintiff', name: '' },
          { role: 'Defendant', name: '' }
        ];
        break;
      case CASE_TYPES.CRIMINAL:
        partyPair = [
          { role: 'State', name: 'Federal Republic of Nigeria' },
          { role: 'Defendant', name: '' }
        ];
        break;
      default:
        partyPair = [
          { role: 'Appellant', name: '' },
          { role: 'Respondent', name: '' }
        ];
    }
    
    onChange(partyPair);
  }, [onChange]);
  
  // Update party name
  const updatePartyName = useCallback((index: number, name: string) => {
    // Make sure the index exists in the array
    if (index >= 0 && index < parties.length) {
      const updatedParties = [...parties];
      updatedParties[index] = {
        ...updatedParties[index],
        name
      };
      onChange(updatedParties);
    }
  }, [parties, onChange]);
  
  // Handle tab change
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setupPartyPair(value);
  }, [setupPartyPair]);
  
  // Initialize default parties on mount, but only once
  useEffect(() => {
    // If there are no parties, add the first ones automatically based on activeTab
    if (parties.length === 0) {
      setupPartyPair(activeTab);
    }
  }, [activeTab, parties.length, setupPartyPair]);

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value={CASE_TYPES.APPEAL}>Appeal Case</TabsTrigger>
          <TabsTrigger value={CASE_TYPES.CIVIL}>Civil Case</TabsTrigger>
          <TabsTrigger value={CASE_TYPES.CRIMINAL}>Criminal Case</TabsTrigger>
        </TabsList>
        
        <TabsContent value={CASE_TYPES.APPEAL} className="space-y-4">
          <FormDescription>
            For appeals from lower courts or tribunals, where one party is appealing a previous decision.
          </FormDescription>
          {parties.map((party, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-3">
                <p className="text-sm font-medium">{index === 0 ? 'Appellant:' : 'Respondent:'}</p>
                <p className="text-xs text-gray-500">
                  {index === 0 
                    ? 'Party appealing the lower court decision' 
                    : 'Party responding to the appeal'}
                </p>
              </div>
              <div className="col-span-9">
                <Input
                  value={party.name}
                  onChange={(e) => updatePartyName(index, e.target.value)}
                  onBlur={onBlur}
                  placeholder={index === 0 
                    ? "Appellant name (e.g., University of Lagos)" 
                    : "Respondent name (e.g., Adeyemi)"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                />
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value={CASE_TYPES.CIVIL} className="space-y-4">
          <FormDescription>
            For original civil trial cases where one party has filed a lawsuit against another.
          </FormDescription>
          {parties.map((party, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-3">
                <p className="text-sm font-medium">{index === 0 ? 'Plaintiff:' : 'Defendant:'}</p>
                <p className="text-xs text-gray-500">
                  {index === 0 
                    ? 'Party filing the lawsuit' 
                    : 'Party being sued'}
                </p>
              </div>
              <div className="col-span-9">
                <Input
                  value={party.name}
                  onChange={(e) => updatePartyName(index, e.target.value)}
                  onBlur={onBlur}
                  placeholder={index === 0 
                    ? "Plaintiff name (e.g., Okafor)" 
                    : "Defendant name (e.g., First Bank of Nigeria)"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                />
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value={CASE_TYPES.CRIMINAL} className="space-y-4">
          <FormDescription>
            For criminal cases where the state or government is prosecuting an individual or entity.
          </FormDescription>
          {parties.map((party, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-3">
                <p className="text-sm font-medium">{index === 0 ? 'State:' : 'Defendant:'}</p>
                <p className="text-xs text-gray-500">
                  {index === 0 
                    ? 'Prosecuting authority' 
                    : 'Person/entity accused of the crime'}
                </p>
              </div>
              <div className="col-span-9">
                <Input
                  value={party.name}
                  onChange={(e) => updatePartyName(index, e.target.value)}
                  onBlur={onBlur}
                  placeholder={index === 0 
                    ? "State name (default: Federal Republic of Nigeria)" 
                    : "Defendant name (e.g., Ojo)"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                />
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
      
      <div className="text-xs text-gray-500 italic mt-3">
        Note: Parties will be formatted in the standard citation format with 'v' between opposing parties
      </div>
    </div>
  );
}