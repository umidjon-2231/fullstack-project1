import { Component } from '@angular/core';
import { LucideAngularModule, Trophy, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-awards-section',
  imports: [LucideAngularModule],
  templateUrl: './awards-section.html',
  styleUrl: './awards-section.scss',
})
export class AwardsSectionComponent {
  protected readonly icons: Record<string, LucideIconData> = { trophy: Trophy };

  protected readonly awards = [
    { title: 'Best Calculator 2025', org: 'Quantum Computing Weekly' },
    { title: 'Golden Abacus Award', org: 'International Math Council' },
    { title: 'Innovation of the Century', org: 'The Daily Integer' },
    { title: 'Most Disruptive Startup', org: 'TechCrunch Numbers' },
    { title: '"Literally Just Math"', org: 'Skeptic Magazine' },
  ];
}
