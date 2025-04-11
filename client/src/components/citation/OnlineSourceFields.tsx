import React from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { format } from "date-fns";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, HelpCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OnlineSourceFieldsProps {
  control: Control<any>;
  sourceType: string;
  setValue: UseFormSetValue<any>;
}

export function OnlineSourceFields({ control, sourceType, setValue }: OnlineSourceFieldsProps) {
  const getToolTipText = () => {
    switch (sourceType) {
      case "book":
        return "The complete URL where the book can be found online";
      case "journalArticle":
        return "The complete URL where the journal article can be found online";
      case "thesis":
        return "The complete URL where the thesis can be found online";
      case "conferencePaper":
        return "The complete URL where the conference paper can be found online";
      case "lecture":
        return "The complete URL where the lecture recording or transcript can be found online";
      case "encyclopedia":
        return "The complete URL where the encyclopedia entry can be found online";
      case "newspaper":
        return "The complete URL where the newspaper article can be found online";
      default:
        return "The complete URL of the online resource";
    }
  };

  const getAccessDateToolTipText = () => {
    switch (sourceType) {
      case "book":
        return "The date when you accessed the online book";
      case "journalArticle":
        return "The date when you accessed the online article";
      case "thesis":
        return "The date when you accessed the online thesis";
      case "conferencePaper":
        return "The date when you accessed the online paper";
      case "lecture":
        return "The date when you accessed the online lecture";
      case "encyclopedia":
        return "The date when you accessed the online encyclopedia";
      case "newspaper":
        return "The date when you accessed the online newspaper article";
      default:
        return "The date when you accessed the online resource";
    }
  };

  const getURLPlaceholder = () => {
    switch (sourceType) {
      case "book":
        return "e.g., https://example.edu/book";
      case "journalArticle":
        return "e.g., https://doi.org/10.1234/journal";
      case "thesis":
        return "e.g., https://repository.example.edu/thesis";
      case "conferencePaper":
        return "e.g., https://example.edu/proceedings";
      case "lecture":
        return "e.g., https://example.edu/lectures/recording";
      case "encyclopedia":
        return "e.g., https://example.edu/encyclopedia/volume";
      case "newspaper":
        return "e.g., https://newspaper.com/article";
      default:
        return "e.g., https://example.com/resource";
    }
  };

  return (
    <div className="space-y-4 pl-4 border-l-2 border-gray-200">
      <FormField
        control={control}
        name="webAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center text-sm font-medium text-gray-700">
              Web Address (URL)
              <span className="text-red-500 ml-1">*</span>
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
            <FormControl>
              <Input
                {...field}
                placeholder={getURLPlaceholder()}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel className="flex items-center text-sm font-medium text-gray-700 mb-2">
          Date of Access
          <span className="text-red-500 ml-1">*</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto ml-1">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-60">{getAccessDateToolTipText()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </FormLabel>

        <div className="grid grid-cols-3 gap-2 mb-2">
          <FormField
            control={control}
            name="accessDay"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Day"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="accessMonth"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="January">January</SelectItem>
                      <SelectItem value="February">February</SelectItem>
                      <SelectItem value="March">March</SelectItem>
                      <SelectItem value="April">April</SelectItem>
                      <SelectItem value="May">May</SelectItem>
                      <SelectItem value="June">June</SelectItem>
                      <SelectItem value="July">July</SelectItem>
                      <SelectItem value="August">August</SelectItem>
                      <SelectItem value="September">September</SelectItem>
                      <SelectItem value="October">October</SelectItem>
                      <SelectItem value="November">November</SelectItem>
                      <SelectItem value="December">December</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="accessYear"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Year"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            // Get the current date
            const today = new Date();
            const day = today.getDate().toString();
            const month = format(today, 'MMMM');
            const year = today.getFullYear().toString();
            
            // Update the form with the current date values
            setValue('accessDay', day);
            setValue('accessMonth', month);
            setValue('accessYear', year);
            setValue('accessDate', `${day} ${month} ${year}`);
          }}
          className="flex items-center text-[#1B387A]"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Use Today's Date
        </Button>
      </div>
    </div>
  );
}