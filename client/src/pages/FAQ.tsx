import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { faqItems } from '@/lib/data';

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>("item-0");

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#1B387A]">Frequently Asked Questions</h2>
          <p className="text-gray-600 mb-8">Find answers to common questions about NALT citation format and legal research standards.</p>
          
          {/* Accordion */}
          <Accordion 
            type="single" 
            collapsible 
            value={openItem ?? undefined}
            onValueChange={(value) => setOpenItem(value)}
            className="space-y-4"
          >
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index}
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="flex justify-between items-center w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none font-medium text-gray-900">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {/* More Questions */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">Still have questions about NALT citation format?</p>
            <Button className="inline-block mt-4 bg-[#1B387A] hover:bg-[#294D98] text-white font-medium py-2 px-6 rounded-md transition duration-150">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
