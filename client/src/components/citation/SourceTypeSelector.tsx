import { useFormContext } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SourceType } from '@/lib/types';
import BookForm from './BookForm';
import BookChapterForm from './BookChapterForm';
import CaseForm from './CaseForm';
import JournalArticleForm from './JournalArticleForm';
import NewspaperForm from './NewspaperForm';
import OnlineSourceForm from './OnlineSourceForm';
import StatuteForm from './StatuteForm';
import ConferencePaperForm from './ConferencePaperForm';
import ThesisForm from './ThesisForm';
import LectureForm from './LectureForm';
import EncyclopediaForm from './EncyclopediaForm';
import MonographForm from './MonographForm';
import LectureNoteForm from './LectureNoteForm';

export default function SourceTypeSelector() {
  const form = useFormContext();
  const sourceType = form.watch('sourceType') as SourceType;

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="sourceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">Source Type</FormLabel>
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""}
              >
                <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#294D98] focus:border-[#294D98]">
                  <SelectValue placeholder="Select a source type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="case">Cases</SelectItem>
                  <SelectItem value="statute">Statutes</SelectItem>
                  <SelectItem value="book">Books</SelectItem>
                  <SelectItem value="bookChapter">Chapters in Edited Books</SelectItem>
                  <SelectItem value="journalArticle">Journal Articles</SelectItem>
                  <SelectItem value="onlineSource">Online Sources</SelectItem>
                  <SelectItem value="conferencePaper">Conference Papers</SelectItem>
                  <SelectItem value="newspaper">Newspapers/Magazines</SelectItem>
                  <SelectItem value="thesis">Projects/Theses</SelectItem>
                  <SelectItem value="lecture">Inaugural/Distinguished Lectures</SelectItem>
                  <SelectItem value="encyclopedia">Encyclopedias</SelectItem>
                  <SelectItem value="monograph">Monographs</SelectItem>
                  <SelectItem value="lectureNote">Lecture Notes</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {sourceType && (
        <div className="mt-6">
          {sourceType === 'book' && <BookForm />}
          {sourceType === 'bookChapter' && <BookChapterForm />}
          {sourceType === 'case' && <CaseForm />}
          {sourceType === 'journalArticle' && <JournalArticleForm />}
          {sourceType === 'newspaper' && <NewspaperForm />}
          {sourceType === 'onlineSource' && <OnlineSourceForm />}
          {sourceType === 'statute' && <StatuteForm />}
          {sourceType === 'conferencePaper' && <ConferencePaperForm />}
          {sourceType === 'thesis' && <ThesisForm />}
          {sourceType === 'lecture' && <LectureForm />}
          {sourceType === 'encyclopedia' && <EncyclopediaForm />}
          {sourceType === 'monograph' && <MonographForm />}
          {sourceType === 'lectureNote' && <LectureNoteForm />}
        </div>
      )}
    </div>
  );
}