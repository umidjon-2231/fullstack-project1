import { Component } from '@angular/core';
import { LucideAngularModule, Quote, Star, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-testimonials-section',
  imports: [LucideAngularModule],
  templateUrl: './testimonials-section.html',
  styleUrl: './testimonials-section.scss',
})
export class TestimonialsSectionComponent {
  protected readonly icons: Record<string, LucideIconData> = { quote: Quote, star: Star };

  protected readonly starRange = [1, 2, 3, 4, 5];

  protected readonly testimonials = [
    { quote: 'This changed everything. I used to count on my fingers. Now I count on CALCUL8R. My fingers have never been happier.', author: 'Dr. Sarah Chen', role: 'CEO of Mathematics', stars: 5 },
    { quote: 'I was skeptical about this "calculator" thing. But after my first addition, I wept. Pure, unfiltered numerical clarity.', author: 'Marcus Webb', role: 'Former Professional Finger-Counter', stars: 5 },
    { quote: 'Our abacus sales dropped 400% overnight. These people are monsters.', author: 'Takeshi Yamamoto', role: 'International Abacus Federation', stars: 1 },
    { quote: 'I input 2 + 2 and it said 4. I checked manually. It was right. I\'m still shaking.', author: 'Anonymous', role: 'Beta Tester', stars: 5 },
    { quote: 'My grandson showed me this and now I can finally check if the grocery store is overcharging me. They were. Every time.', author: 'Grandma Rose', role: 'Retired, Age 83', stars: 5 },
    { quote: 'We tried to reverse-engineer it. When we opened the case, there was just a note that said "nice try." Absolute legends.', author: 'Jae-won Park', role: 'Lead Engineer, Samsung Calculators Division', stars: 4 },
  ];
}
