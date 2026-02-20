import { AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, signal } from '@angular/core';
import { BootOverlayComponent } from '../../components/boot-overlay/boot-overlay';
import { CursorGlowComponent } from '../../components/cursor-glow/cursor-glow';
import { ConfettiComponent } from '../../components/confetti/confetti';
import { HeroSectionComponent } from '../../components/hero-section/hero-section';
import { StatsBarComponent } from '../../components/stats-bar/stats-bar';
import { PressBarComponent } from '../../components/press-bar/press-bar';
import { FeaturesSectionComponent } from '../../components/features-section/features-section';
import { TestimonialsSectionComponent } from '../../components/testimonials-section/testimonials-section';
import { AwardsSectionComponent } from '../../components/awards-section/awards-section';
import { CalculatorWidgetComponent } from '../../components/calculator-widget/calculator-widget';
import { ComparisonSectionComponent } from '../../components/comparison-section/comparison-section';
import { PricingSectionComponent } from '../../components/pricing-section/pricing-section';
import { TeamSectionComponent } from '../../components/team-section/team-section';
import { FaqSectionComponent } from '../../components/faq-section/faq-section';
import { ChangelogSectionComponent } from '../../components/changelog-section/changelog-section';
import { CountdownSectionComponent } from '../../components/countdown-section/countdown-section';
import { NewsletterSectionComponent } from '../../components/newsletter-section/newsletter-section';
import { SiteFooterComponent } from '../../components/site-footer/site-footer';

@Component({
  selector: 'app-calculator-page',
  imports: [
    BootOverlayComponent,
    CursorGlowComponent,
    ConfettiComponent,
    HeroSectionComponent,
    StatsBarComponent,
    PressBarComponent,
    FeaturesSectionComponent,
    TestimonialsSectionComponent,
    AwardsSectionComponent,
    CalculatorWidgetComponent,
    ComparisonSectionComponent,
    PricingSectionComponent,
    TeamSectionComponent,
    FaqSectionComponent,
    ChangelogSectionComponent,
    CountdownSectionComponent,
    NewsletterSectionComponent,
    SiteFooterComponent,
  ],
  templateUrl: './calculator-page.html',
  styleUrl: './calculator-page.scss',
  host: { '[class.konami-active]': 'konamiActive()' },
})
export class CalculatorPage implements AfterViewInit, OnDestroy {
  private readonly elRef = inject(ElementRef);

  protected readonly konamiActive = signal(false);
  protected readonly showConfetti = signal(false);

  private readonly konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  private konamiIndex = 0;
  private revealObserver: IntersectionObserver | null = null;

  ngAfterViewInit() {
    this.revealObserver = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.1 },
    );
    this.elRef.nativeElement.querySelectorAll('.reveal').forEach((el: Element) => {
      this.revealObserver!.observe(el);
    });
  }

  ngOnDestroy() {
    this.revealObserver?.disconnect();
  }

  @HostListener('window:keydown', ['$event'])
  handleKonami(e: KeyboardEvent) {
    if (e.key === this.konamiSequence[this.konamiIndex]) {
      this.konamiIndex++;
      if (this.konamiIndex === this.konamiSequence.length) {
        this.konamiActive.set(true);
        this.konamiIndex = 0;
        setTimeout(() => this.konamiActive.set(false), 5000);
      }
    } else {
      this.konamiIndex = 0;
    }
  }

  onConfettiTrigger() {
    this.showConfetti.set(true);
    setTimeout(() => this.showConfetti.set(false), 3000);
  }
}
