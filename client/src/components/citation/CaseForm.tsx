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
  const caseType = form.watch('caseType') as 'reported' | 'unreported';
  const parties = form.watch('parties') || [];
  const isUnreportedSimple = form.watch('isUnreportedSimple');

  // When parties change, update the caseName field to show the formatted citation
  useEffect(() => {
    if (parties.length > 0) {
      // Find the first plaintiff/appellant and defendant/respondent
      const plaintiff = parties.find((p: Party) => 
        ['Plaintiff', 'Appellant', 'Applicant', 'Petitioner'].includes(p.role)
      );
      const defendant = parties.find((p: Party) => 
        ['Defendant', 'Respondent', 'Accused', 'Objector'].includes(p.role)
      );
      
      if (plaintiff && plaintiff.name && defendant && defendant.name) {
        // Format the case name - only update if both have names entered
        const caseName = `${plaintiff.name} v ${defendant.name}`;
        form.setValue('caseName', caseName, { shouldValidate: true });
      }
    }
  }, [parties, form]);

  // Set default values on mount
  useEffect(() => {
    // Set defaults for all necessary fields to avoid uncontrolled to controlled warnings
    const defaults = {
      caseType: 'reported',
      parties: form.getValues('parties') || [],
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
      accessDate: ''
    };
    
    // Apply all default values that aren't already set
    Object.entries(defaults).forEach(([key, value]) => {
      if (form.getValues(key) === undefined) {
        form.setValue(key, value);
      }
    });
    
  }, [form]);

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