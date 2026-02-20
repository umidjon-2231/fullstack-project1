import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
  host: { '(mousemove)': 'null' },
})
export class HeroSectionComponent {
  protected readonly particles = Array.from({ length: 8 }, (_, i) => i + 1);

  scrollToCalculator() {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  }
}
