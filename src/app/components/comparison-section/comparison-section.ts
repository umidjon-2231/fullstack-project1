import { Component } from '@angular/core';
import { LucideAngularModule, Check, X, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-comparison-section',
  imports: [LucideAngularModule],
  templateUrl: './comparison-section.html',
  styleUrl: './comparison-section.scss',
})
export class ComparisonSectionComponent {
  protected readonly icons: Record<string, LucideIconData> = { check: Check, x: X };

  protected readonly headers = ['Feature', 'CALCUL8R', 'Abacus', 'Fingers', 'Guessing'];
  protected readonly rows = [
    { feature: 'Speed', values: ['Quantum', 'Slow', 'Medium', 'Instant'] },
    { feature: 'Max Digits', values: ['∞*', '~13', '10', '???'] },
    { feature: 'Accuracy', values: ['99.97%', '~98%', 'Debatable', '~12%'] },
    { feature: 'Cloud Sync', values: ['check', 'x', 'x', 'x'] },
    { feature: 'AI Powered', values: ['check', 'x', 'x', 'x'] },
    { feature: 'Blockchain', values: ['check', 'x', 'x', 'x'] },
    { feature: 'Price', values: ['$9,999/mo', '$15', 'Free', 'Free'] },
    { feature: 'Looks Cool', values: ['check', 'check', 'x', 'x'] },
  ];
}
