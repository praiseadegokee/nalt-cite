import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import OnlineAccessFields from './OnlineAccessFields';
import PartyInput from './PartyInput';
import { useEffect } from 'react';
import { Party } from '@/lib/types';

export default function CaseForm() {
  const form = useFormContext();
  // Ensure these values are never undefined to prevent controlled/uncontrolled component warnings
  const caseType = form.watch('caseType') as 'reported' | 'unreported' || 'reported';
  const parties = form.watch('parties') || [];
  const isUnreportedSimple = form.watch('isUnreportedSimple') ?? false;

  // Update case name when parties change
  useEffect(() => {
    if (parties.length >= 2) { // Only update if we have at least two parties
      // Find the first plaintiff/appellant and defendant/respondent
      const plaintiffRoles = ['Plaintiff', 'Appellant', 'Applicant', 'Petitioner'];
      const defendantRoles = ['Defendant', 'Respondent', 'Accused', 'Objector'];
      
      const plaintiff = parties.find((p: Party) => 
        plaintiffRoles.includes(p.role) && p.name.trim() !== ''
      );
      
      const defendant = parties.find((p: Party) => 
        defendantRoles.includes(p.role) && p.name.trim() !== ''
      );
      
      if (plaintiff?.name && defendant?.name) {
        // Format the case name - only update if both have names entered
        const caseName = `${plaintiff.name} v ${defendant.name}`;
        form.setValue('caseName', caseName, { shouldValidate: true });
      }
    }
  }, [parties, form]);

  // Set default values on mount - only run once
  useEffect(() => {
    console.log("CaseForm: Initializing default values");
    
    // Define all fields with default values to prevent uncontrolled->controlled warnings
    const defaults = {
      sourceType: 'case', // Ensure sourceType is set to 'case'
      caseType: 'reported',
      parties: [
        { role: 'Plaintiff', name: '' },
        { role: 'Defendant', name: '' }
      ],
      isUnreportedSimple: false,
      caseName: '',
      yearReported: '',
      volumeNumber: '',
      partNumber: '',
      lawReportAbbreviation: '',
      pageNumber: '',
      caseNumber: '',
      court: '',
      judgmentDate: '',
      isOnlineSource: false,
      webAddress: '',
      accessDate: '',
      // Include date-related fields for access date
      accessDateDay: new Date().getDate().toString(),
      accessDateMonth: (new Date().getMonth() + 1).toString(),
      accessDateYear: new Date().getFullYear().toString()
    };
    
    console.log("CaseForm: Current sourceType value:", form.getValues('sourceType'));
    
    // Explicitly set sourceType to 'case' regardless of current value to ensure consistency
    form.setValue('sourceType', 'case', { shouldValidate: false });
    
    // Batch update all fields that aren't already set
    const fieldsToUpdate: Record<string, any> = {};
    Object.entries(defaults).forEach(([key, value]) => {
      const currentValue = form.getValues(key);
      if (currentValue === undefined || 
          (Array.isArray(currentValue) && currentValue.length === 0)) {
        fieldsToUpdate[key] = value;
      }
    });
    
    console.log("CaseForm: Fields to update:", fieldsToUpdate);
    
    // Apply updates in batch to minimize rerenders
    if (Object.keys(fieldsToUpdate).length > 0) {
      Object.entries(fieldsToUpdate).forEach(([key, value]) => {
        form.setValue(key, value, { shouldValidate: false });
      });
    }
  }, [form]); // Include form as dependency for the hook

  return (
    <div className="space-y-8">
      {/* Case Type Selection */}
      <FormField
        control={form.control}
        name="caseType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Case Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reported" id="reported" />
                  <Label htmlFor="reported">Reported Case</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unreported" id="unreported" />
                  <Label htmlFor="unreported">Unreported Case</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Party Names (Dynamic Input) */}
      <FormField
        control={form.control}
        name="parties"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Party Names</FormLabel>
            <FormDescription>
              Add parties involved in the case with their respective roles
            </FormDescription>
            <FormControl>
              <PartyInput
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Hidden caseName field that gets auto-populated */}
      <FormField
        control={form.control}
        name="caseName"
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />
      
      {/* Conditional Fields Based on Case Type */}
      {caseType === 'reported' && (
        <div className="space-y-6 p-4 border border-gray-200 rounded-md bg-blue-50/30 animate-in fade-in">
          <h3 className="font-medium text-gray-800">Reported Case Details</h3>
          
          <FormField
            control={form.control}
            name="yearReported"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Year Reported</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., 2007" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="volumeNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Volume Number</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g., 30" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="partNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Part Number</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g., Pt 4" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lawReportAbbreviation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Law Report Abbreviation</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g., NSCQR, NWLR" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="pageNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Page Number(s)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., 550" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      
      {caseType === 'unreported' && (
        <div className="space-y-6 p-4 border border-gray-200 rounded-md bg-blue-50/30 animate-in fade-in">
          <h3 className="font-medium text-gray-800">Unreported Case Details</h3>
          
          <FormField
            control={form.control}
            name="isUnreportedSimple"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Simply add "(unreported)" to citation
                  </FormLabel>
                  <FormDescription>
                    Check this if you want to use the simplified format instead of providing detailed unreported case information
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          {!isUnreportedSimple && (
            <>
              <FormField
                control={form.control}
                name="caseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Suit/Case Number</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., FHC/J/CRC/10/2015" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="court"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Court Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Federal High Court Jos Judicial Division" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="judgmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Date of Decision</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., 17 June 2016" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      )}
      
      {/* Online Access Fields */}
      <OnlineAccessFields 
        toggleField="isOnlineSource"
        urlField="webAddress"
        accessDateField="accessDate"
      />
    </div>
  );
}