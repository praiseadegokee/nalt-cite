import { 
  FileText, 
  Settings, 
  Globe, 
  HelpCircle, 
  Newspaper, 
  Download,
  Bot
} from 'lucide-react';
import { Feature, GlossaryTerm, FAQ, BlogPost, Resource, GuidelinePart } from './types';

// Features for homepage
export const features: Feature[] = [
  {
    title: 'AI Citation Assistant',
    description: 'Ask questions about NALT guidelines and OSCOLA standards. Get instant, accurate answers from uploaded documents.',
    icon: Bot,
    link: '/chat',
    linkText: 'Start chatting',
  },
  {
    title: 'Citation Generator',
    description: 'Create perfectly formatted NALT citations for various legal sources instantly.',
    icon: Settings,
    link: '/citation-generator',
    linkText: 'Try it now',
  },
  {
    title: 'NALT Citation Guide',
    description: 'Access the complete official guide with detailed examples and formatting rules.',
    icon: FileText,
    link: '/resources',
    linkText: 'Learn more',
  },
  {
    title: 'Legal Glossary',
    description: 'Browse comprehensive definitions of legal citation and research terminology.',
    icon: Globe,
    link: '/glossary',
    linkText: 'Explore terms',
  },
  {
    title: 'FAQ Section',
    description: 'Find answers to common questions about NALT citation formats and rules.',
    icon: HelpCircle,
    link: '/faq',
    linkText: 'View FAQs',
  },
  {
    title: 'Blog',
    description: 'Stay updated with the latest articles on legal writing, research tips, and citation advice.',
    icon: Newspaper,
    link: '/blog',
    linkText: 'Read articles',
  },
  {
    title: 'Resources',
    description: 'Download templates, checklists, and additional guides for legal writing and citation.',
    icon: Download,
    link: '/resources',
    linkText: 'Access resources',
  },
];

// Glossary terms
export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Ab Initio',
    definition: 'Latin term meaning "from the beginning" or "from inception." In legal contexts, it is used to indicate that something was invalid, void, or otherwise ineffective from the very start.',
    category: 'legal',
  },
  {
    term: 'Abbreviation',
    definition: 'A shortened form of a written word or phrase used in a citation. The NALT Guide provides specific rules for standard abbreviations of legal sources, journals, and courts.',
    category: 'citation',
  },
  {
    term: 'Academic Journal',
    definition: 'A scholarly periodical publication containing articles written by researchers, professors, and other experts. Legal academic journals publish articles on legal analysis, legal developments, and jurisprudence.',
    category: 'research',
  },
  {
    term: 'All Nigeria Law Reports (All NLR)',
    definition: 'A series of law reports that contain selected judgments of Nigerian courts. Citations to All NLR include the year, volume, and page number.',
    category: 'citation',
  },
];

// FAQ items
export const faqItems: FAQ[] = [
  {
    question: 'What is the NALT Citation Guide?',
    answer: 'The NALT Citation Guide is the official standard published by the Nigerian Association of Law Teachers for formatting legal citations in academic writing, research papers, and publications in Nigeria. It provides comprehensive rules for citing various legal sources including cases, statutes, books, journal articles, and other materials relevant to Nigerian legal scholarship.',
  },
  {
    question: 'How does NALT citation differ from OSCOLA?',
    answer: 'While NALT citation format shares some similarities with the Oxford Standard for Citation of Legal Authorities (OSCOLA), it has been specifically adapted for the Nigerian legal system. Key differences include specialized rules for citing Nigerian cases, statutes, and legal materials, as well as variations in punctuation, abbreviation conventions, and formatting requirements tailored to Nigerian legal scholarship practices.',
  },
  {
    question: 'How do I cite Nigerian court cases?',
    answer: 'Nigerian court cases should be cited following this format: <i>Case Name</i> [Year] Volume Law Report Abbreviation Starting Page. For example: <i>Garba v. University of Maiduguri</i> [1986] 1 NWLR (Pt 18) 550. If citing a specific page, add the page number after the starting page, e.g., <i>Garba v. University of Maiduguri</i> [1986] 1 NWLR (Pt 18) 550, 575.',
  },
  {
    question: 'When should I use ibid, supra, and op cit?',
    answer: 'Under NALT citation rules:<br><br><strong>Ibid</strong> (meaning "in the same place") is used when referencing the exact same source as in the immediately preceding footnote.<br><br><strong>Supra</strong> (meaning "above") is used to refer to a source cited earlier but not in the immediately preceding footnote. Format: Author Surname, supra note X, at [page].<br><br><strong>Op cit</strong> is generally not recommended in NALT citation format; use supra instead.',
  },
  {
    question: 'How do I format a bibliography in NALT style?',
    answer: 'A NALT bibliography should be divided into sections for different types of sources (e.g., Cases, Legislation, Books, Journal Articles, etc.). Within each section, entries should be alphabetically arranged. Unlike footnotes, bibliography entries place the author\'s surname first, followed by initials. For example, a book in footnotes appears as "O Oyewo, <i>Constitutional Law in Nigeria</i> (2nd edn, University Press 2018)" but in a bibliography would be "Oyewo, O, <i>Constitutional Law in Nigeria</i> (2nd edn, University Press 2018)".',
  },
];

// Blog posts
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Understanding the New NALT Citation Rules for Online Sources',
    excerpt: 'The digital age has brought new challenges for legal citation. Learn how the latest NALT Guide addresses electronic resources, social media citations, and other digital materials in legal writing.',
    content: '<p>The digital revolution has transformed legal research and writing, bringing with it new challenges for citation standards. The Nigerian Association of Law Teachers has responded by updating the NALT Citation Guide to address electronic resources, online databases, social media content, and other digital materials that are increasingly being cited in legal scholarship.</p><p>This article explores the key changes in the latest edition of the NALT Guide, providing practical examples and clarity on how to properly cite everything from online journal articles to social media posts in your legal writing.</p>',
    date: '2023-09-15',
    author: 'Dr. Amina Bello',
    readTime: 8,
    category: 'Citation Tips',
    tags: ['Digital Resources', 'Online Citation', 'NALT Updates', 'Legal Writing']
  },
  {
    id: 2,
    title: 'Common Citation Mistakes in Nigerian Legal Writing',
    excerpt: 'Explore the most frequent errors in legal citations and how to avoid them in your academic papers and legal documents.',
    content: '<p>Even experienced legal scholars can make citation errors that undermine the credibility of their work. This article identifies the most common mistakes observed in Nigerian legal writing and provides practical guidance on how to avoid them.</p><p>From inconsistent formatting to improper abbreviations and incorrect use of Latin terms, we cover the pitfalls that frequently trip up law students and practitioners alike. By understanding these common errors, you can ensure your legal writing meets the high standards expected in academic and professional contexts.</p>',
    date: '2023-08-28',
    author: 'Prof. Oluwaseun Adeyemi',
    readTime: 6,
    category: 'Citation Tips',
    tags: ['Common Errors', 'Legal Writing', 'Citation Accuracy', 'Best Practices']
  },
  {
    id: 3,
    title: 'Effective Legal Research Strategies for Nigerian Law Students',
    excerpt: 'Discover techniques and resources to enhance your research skills and produce high-quality legal papers.',
    content: '<p>Effective legal research is the foundation of strong legal writing. This article presents a comprehensive guide to research methodologies and resources specifically relevant to Nigerian law students and researchers.</p><p>From navigating physical law libraries to leveraging online databases and digital archives, we provide step-by-step guidance on building a robust research strategy. The article also covers techniques for evaluating source reliability, organizing research findings, and integrating research effectively into your legal writing.</p>',
    date: '2023-08-15',
    author: 'Dr. Ngozi Okonkwo',
    readTime: 7,
    category: 'Research Methods',
    tags: ['Research Skills', 'Nigerian Legal Resources', 'Law Libraries', 'Online Databases']
  },
  {
    id: 4,
    title: 'Structuring Your Law Dissertation: A Step-by-Step Guide',
    excerpt: 'Learn how to organize your dissertation effectively, from literature review to conclusion, following best practices.',
    content: '<p>Writing a law dissertation is a significant undertaking that requires careful planning and structure. This guide breaks down the process into manageable steps, helping you develop a well-organized and cohesive dissertation that meets academic standards.</p><p>We cover everything from selecting a research question and conducting a literature review to structuring your chapters, integrating NALT citations correctly, and crafting a compelling conclusion. The article includes practical tips, formatting guidance, and examples to help you navigate the dissertation writing process with confidence.</p>',
    date: '2023-08-03',
    author: 'Prof. Emmanuel Ojo',
    readTime: 9,
    category: 'Academic Writing',
    tags: ['Dissertation Writing', 'Research Structure', 'Academic Standards', 'Legal Methodology']
  }
];

// NALT Guideline Parts
export const guidelineParts: GuidelinePart[] = [
  {
    id: 'complete-guide',
    title: 'NALT Citation Guidelines - Complete',
    description: 'The complete NALT Uniform Format and Citation Guide document',
    filename: 'NALT Uniform Format and Citation Guide for Legal Research Writing in Nigeria'
  },
  {
    id: 'part1',
    title: 'Part 1: Background Information',
    description: 'Background information to NALT Format',
    filename: 'NALT Uniform Format and Citation Guide (Part One - Background Information to NALT Format)'
  },
  {
    id: 'part2',
    title: 'Part 2: NALT Format and Research Topics',
    description: 'NALT Format and the Structuring of Research Topics',
    filename: 'NALT Uniform Format and Citation Guide (Part Two - NALT Format and the Structuring of Research Topics)'
  },
  {
    id: 'part3',
    title: 'Part 3: NALT Citation Guidelines',
    description: 'NALT Citation Guidelines for Style of Referencing',
    filename: 'NALT Uniform Format and Citation Guide (Part Three - NALT Citation Guidelines for Style of Referencing)'
  },
  {
    id: 'part4',
    title: 'Part 4: Format for Journal Articles',
    description: 'Format for Articles in Journal for Publication',
    filename: 'NALT Uniform Format and Citation Guide (Part Four - Format for Articles in Journal for Publication)'
  }
];

/**
 * Helper function to check which guideline parts are available based on the uploaded files
 * This function is meant to be used server-side, but for the demo we'll assume all parts are available
 */
export function getAvailableGuidelineParts(): GuidelinePart[] {
  // In a real application, this would check if the files exist
  // For this demo, we're returning all parts but in a real app
  // you might filter based on file existence
  return guidelineParts;
}

// Resources
export const resources: Resource[] = [
  {
    title: 'NALT Citation Quick Reference Guide',
    description: 'A condensed version of the most common citation formats for quick reference.',
    type: 'pdf',
    size: '2.4 MB',
    downloadUrl: '/api/downloads/citation-quick-reference',
    category: 'citation'
  },
  {
    title: 'NALT vs. OSCOLA Comparison Chart',
    description: 'Side-by-side comparison of Nigerian and Oxford citation styles for legal writing.',
    type: 'pdf',
    size: '1.8 MB',
    downloadUrl: '/api/downloads/nalt-oscola-comparison',
    category: 'citation'
  },
  {
    title: 'Undergraduate Essay Template',
    description: 'Pre-formatted Word document with proper NALT citation styles and margin settings.',
    type: 'docx',
    size: '536 KB',
    downloadUrl: '/api/downloads/undergraduate-template',
    category: 'templates'
  },
  {
    title: 'Master\'s Dissertation Template',
    description: 'Complete template with sections, formatting, and citation styles for postgraduate work.',
    type: 'docx',
    size: '782 KB',
    downloadUrl: '/api/downloads/masters-template',
    category: 'templates'
  },
  {
    title: 'Citation Proofreading Checklist',
    description: 'Comprehensive checklist to ensure all your citations comply with NALT standards.',
    type: 'pdf',
    size: '420 KB',
    downloadUrl: '/api/downloads/citation-checklist',
    category: 'checklists'
  },
  {
    title: 'NALT Citation Video Tutorials',
    description: 'A series of instructional videos demonstrating how to correctly format various citation types.',
    type: 'video',
    downloadUrl: '/resources/videos',
    category: 'tutorials'
  }
];
