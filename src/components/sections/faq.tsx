import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

interface FaqProps {
  readonly items: readonly FaqItem[];
}

export function Faq({ items }: FaqProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem key={item.question} value={item.question}>
          <AccordionTrigger className="text-left text-base">{item.question}</AccordionTrigger>
          <AccordionContent className="text-pretty text-muted-foreground leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
