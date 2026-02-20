import { Component, signal } from '@angular/core';
import { LucideAngularModule, ChevronDown, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-faq-section',
  imports: [LucideAngularModule],
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.scss',
})
export class FaqSectionComponent {
  protected readonly icons: Record<string, LucideIconData> = { 'chevron-down': ChevronDown };

  protected readonly faqOpen = signal<number | null>(null);

  protected readonly faqs = [
    { question: 'Can it divide by zero?', answer: 'Our quantum processors can theoretically divide by zero, but our legal team has advised against it. The last time we tried, three engineers disappeared for 48 hours and came back speaking only in hexadecimal.' },
    { question: 'Will this replace my accountant?', answer: 'CALCUL8R is not designed to replace your accountant. It is designed to make your accountant feel inadequate.' },
    { question: 'Is the blockchain verification necessary?', answer: 'Absolutely. Without blockchain verification, how would you prove that 7 + 3 = 10? Anyone could claim it equals 11 and you\'d have no cryptographic evidence to the contrary.' },
    { question: 'What happens if I exceed my calculation limit?', answer: 'On the Basic plan, exceeding 1 calculation per minute triggers a 60-second cooldown period during which the display shows a motivational quote about patience.' },
    { question: 'Is modulo really only for Enterprise?', answer: 'Yes. The modulo operation is extremely powerful and in the wrong hands could be devastating. All Enterprise users undergo a 3-day modulo safety training course.' },
    { question: 'Why is it so expensive?', answer: 'We prefer the term "appropriately valued." Do you know how much quantum tunnels cost? We don\'t either, but it sounds expensive.' },
  ];

  toggleFaq(index: number) {
    this.faqOpen.update(current => current === index ? null : index);
  }
}
