import { Component, OnDestroy, signal, computed, viewChild, ElementRef } from '@angular/core';
import { LucideAngularModule, Mail, type LucideIconData } from 'lucide-angular';

const PHASES = [
  'VERIFYING HUMANITY...',
  'SCANNING 7 DIMENSIONS...',
  'QUANTUM ENTANGLING...',
  'BLOCKCHAIN LOGGING EMAIL...',
];

const APOCALYPSE_EVENTS: { headline: string; detail: string; casualty: string }[] = [
  {
    headline: 'DIMENSION 7 HAS COLLAPSED',
    detail: 'Your malformed email caused a quantum parse error that destabilized the 7th dimension. It no longer exists.',
    casualty: '4.2 billion beings in Dimension 7 have filed a complaint.',
  },
  {
    headline: '47 STARS HAVE BEEN UNMADE',
    detail: 'The @ symbol you omitted was load-bearing. 47 stars in the Cygnus arm have blinked out of existence.',
    casualty: 'The Council of Dimensions holds you personally responsible.',
  },
  {
    headline: 'TIMELINE ALPHA HAS BEEN CORRUPTED',
    detail: 'Your input was interpreted as a forbidden string in Timeline Alpha. All calendars there now read February 30th.',
    casualty: 'Every meeting ever scheduled has been cancelled retroactively.',
  },
  {
    headline: 'THE INTERNET HAS BEEN BRIEFLY UNMADE',
    detail: 'For 0.003 milliseconds, the entire internet ceased to exist due to your invalid email. It has since been restored. Mostly.',
    casualty: '1 JPEG of a cat is permanently missing. We know which one.',
  },
  {
    headline: 'GRAVITY HAS BEEN TEMPORARILY REVOKED',
    detail: 'Our validation engine runs on quantum fabric. Your typo introduced a null pointer in spacetime. Gravity in a 3km radius glitched for 0.0001 seconds.',
    casualty: 'Several pigeons are confused. One has achieved orbit.',
  },
  {
    headline: '3 PARALLEL UNIVERSES HAVE IMPLODED',
    detail: 'In those universes, a valid email was expected. The mismatch caused an existential type error with no catch block.',
    casualty: 'The alternate versions of you in those universes are also displeased.',
  },
  {
    headline: 'THE NUMBER 8 HAS BEEN RECALLED',
    detail: 'Your invalid email triggered a cascade that caused the number 8 to be temporarily unlicensed. Calculators worldwide displayed ??? for 2 seconds.',
    casualty: 'CALCUL8R was the most affected. We are not okay.',
  },
];

const CONSENT_ERRORS = [
  'The dimensions require your consent before proceeding. They asked nicely.',
  'You cannot be quantum-entangled without formal agreement. It is rude.',
  'Dimension 4 is waiting. Check the box.',
  'Consent is mandatory in all 11 dimensions. You have skipped step 1.',
  'The checkbox exists for a reason. That reason is: the void demands it.',
];

@Component({
  selector: 'app-newsletter-section',
  imports: [LucideAngularModule],
  templateUrl: './newsletter-section.html',
  styleUrl: './newsletter-section.scss',
})
export class NewsletterSectionComponent implements OnDestroy {
  protected readonly icons: Record<string, LucideIconData> = { mail: Mail };

  // Direct DOM reference — read value only on submit, never during typing
  protected readonly emailInputRef = viewChild<ElementRef<HTMLInputElement>>('emailInput');

  // Only tracks whether the input has any content — does NOT store the value
  // so typing does not trigger signal-driven re-renders of the input
  protected readonly hasEmailContent = signal(false);

  protected readonly submitted = signal(false);
  protected readonly consentChecked = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly phaseLabel = signal('');
  protected readonly progressPercent = signal(0);

  // Apocalypse state
  protected readonly apocalypseActive = signal(false);
  protected readonly apocalypseEvent = signal<typeof APOCALYPSE_EVENTS[0] | null>(null);

  // Consent error state
  protected readonly consentErrorActive = signal(false);
  protected readonly consentErrorMsg = signal('');

  protected readonly btnEnabled = computed(() =>
    this.hasEmailContent() && !this.isSubmitting()
  );

  private timers: ReturnType<typeof setTimeout>[] = [];

  submit(): void {
    if (this.isSubmitting()) return;

    const emailValue = this.emailInputRef()?.nativeElement.value ?? '';
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    // Step 1: consent must be checked first
    if (!this.consentChecked()) {
      this.triggerConsentError();
      return;
    }

    // Step 2: email must be valid
    if (!emailValid) {
      this.triggerApocalypse();
      return;
    }

    // All good — proceed
    this.apocalypseEvent.set(null);
    this.consentErrorMsg.set('');
    this.isSubmitting.set(true);
    this.progressPercent.set(0);

    const phaseDuration = 800;
    PHASES.forEach((phase, i) => {
      this.timers.push(setTimeout(() => {
        this.phaseLabel.set(phase);
        this.progressPercent.set(Math.round(((i + 1) / PHASES.length) * 100));
      }, i * phaseDuration));
    });

    this.timers.push(setTimeout(() => {
      this.submitted.set(true);
      this.isSubmitting.set(false);
      this.hasEmailContent.set(false);
      this.consentChecked.set(false);
      const inputEl = this.emailInputRef()?.nativeElement;
      if (inputEl) inputEl.value = '';
    }, PHASES.length * phaseDuration + 300));
  }

  private triggerApocalypse(): void {
    this.consentErrorMsg.set('');
    const event = APOCALYPSE_EVENTS[Math.floor(Math.random() * APOCALYPSE_EVENTS.length)];
    this.apocalypseEvent.set(event);
    this.apocalypseActive.set(true);
    this.timers.push(setTimeout(() => this.apocalypseActive.set(false), 800));
  }

  private triggerConsentError(): void {
    this.apocalypseEvent.set(null);
    this.consentErrorMsg.set(CONSENT_ERRORS[Math.floor(Math.random() * CONSENT_ERRORS.length)]);
    this.consentErrorActive.set(true);
    this.timers.push(setTimeout(() => this.consentErrorActive.set(false), 600));
  }

  ngOnDestroy(): void {
    this.timers.forEach(t => clearTimeout(t));
  }
}
