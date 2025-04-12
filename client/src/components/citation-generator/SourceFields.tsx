import React from 'react';
import { SourceType } from '@/lib/types';
import { BookFields } from './BookFields';
import { JournalArticleFields } from './JournalArticleFields';
import { CaseFields } from './CaseFields';
import { StatuteFields } from './StatuteFields';
import { ThesisFields } from './ThesisFields';
import { WebResourceFields } from './WebResourceFields';
import { NewspaperFields } from './NewspaperFields';

interface SourceFieldsProps {
  sourceType: SourceType;
  control: any;
  watch: any;
  setValue: any;
}

export function SourceFields({ sourceType, control, watch, setValue }: SourceFieldsProps) {
  switch (sourceType) {
    case 'book':
      return <BookFields control={control} watch={watch} setValue={setValue} />;
      
    case 'journalArticle':
      return <JournalArticleFields control={control} watch={watch} setValue={setValue} />;
      
    case 'case':
      return <CaseFields control={control} watch={watch} setValue={setValue} />;
      
    case 'statute':
      return <StatuteFields control={control} watch={watch} setValue={setValue} />;
      
    case 'thesis':
      return <ThesisFields control={control} watch={watch} setValue={setValue} />;
      
    case 'webResource':
      return <WebResourceFields control={control} watch={watch} setValue={setValue} />;
      
    case 'newspaper':
      return <NewspaperFields control={control} watch={watch} setValue={setValue} />;
      
    default:
      return null;
  }
}