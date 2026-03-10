import { Component, OnDestroy, signal } from '@angular/core';

import { CalculatorWidgetComponent } from '../../components/calculator-widget/calculator-widget';
import { ConfettiComponent } from '../../components/confetti/confetti';
import { CursorGlowComponent } from '../../components/cursor-glow/cursor-glow';
import { SiteFooterComponent } from '../../components/site-footer/site-footer';

@Component({
  selector: 'app-preview-page',
  imports: [
    CalculatorWidgetComponent,
    ConfettiComponent,
    CursorGlowComponent,
    SiteFooterComponent,
  ],
  templateUrl: './preview-page.html',
  styleUrl: './preview-page.scss',
})
export class PreviewPage implements OnDestroy {
  protected readonly showConfetti = signal(false);

  private confettiTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnDestroy() {
    if (this.confettiTimeout) {
      clearTimeout(this.confettiTimeout);
    }
  }

  protected onConfettiTrigger() {
    this.showConfetti.set(true);

    if (this.confettiTimeout) {
      clearTimeout(this.confettiTimeout);
    }

    this.confettiTimeout = setTimeout(() => {
      this.showConfetti.set(false);
      this.confettiTimeout = null;
    }, 3000);
  }
}
