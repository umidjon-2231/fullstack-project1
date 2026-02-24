import { Component, OnDestroy, HostListener, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule, Check, X, type LucideIconData } from 'lucide-angular';

type TierKey = 'basic' | 'pro' | 'enterprise';
type FlowState = 'idle' | 'quiz' | 'pro-form' | 'enterprise-form' | 'processing' | 'approved' | 'failed' | 'fail-menu' | 'ad-watching' | 'worthy-wait' | 'pending' | 'authorized';

// ─── BASIC QUIZ ───────────────────────────────────────────────────────────────

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

const BASIC_QUESTIONS: QuizQuestion[] = [
  {
    question: 'What is 2 + 2 in quantum mode?',
    options: ['4', 'Both 4 and not 4', 'Subscription required', 'Please hold'],
    correctIndex: 1,
  },
  {
    question: 'How many kidneys are you willing to allocate to SaaS?',
    options: ['0 (I need those)', '1 (starter package)', 'Depends on the uptime SLA', 'All of them for Enterprise'],
    correctIndex: 2,
  },
  {
    question: 'Choose your emergency fallback if CALCUL8R goes offline:',
    options: ['Fingers and toes', 'Abacus (unsubscribed)', 'Cry and refresh', 'File a quantum grievance'],
    correctIndex: 2,
  },
  {
    question: 'Do you accept that support response time is measured in lunar cycles?',
    options: ['Yes, reluctantly', 'Also yes', 'I have no choice', 'All of the above'],
    correctIndex: 3,
  },
  {
    question: 'In the event of a miscalculation, who is responsible?',
    options: ['You, obviously', 'The numbers', 'Mercury retrograde', 'We have lawyers'],
    correctIndex: 2,
  },
];

// ─── AD & WORTHY-WAIT DATA ────────────────────────────────────────────────────

const AD_SKIP_START = 4729;

const AD_CONTENTS: { title: string; tagline: string; brand: string }[] = [
  { brand: 'QUANTIUM®', title: 'Blockchain-powered spreadsheet for cats', tagline: 'Finally, DeFi for your pet\'s napping schedule.' },
  { brand: 'TurboDebt™', title: 'Convert your savings into someone else\'s yacht', tagline: 'Faster. Leaner. Gone.' },
  { brand: 'HYPERLOOP TOASTER Pro', title: 'Toast across all 11 dimensions simultaneously', tagline: 'Gluten-free in 7 of them.' },
  { brand: 'NeuroSync™', title: 'The AI stand-up desk that judges your posture', tagline: 'Stand. Sit. Regret. Repeat.' },
  { brand: 'VOIDMAIL®', title: 'Email that delivers to parallel universes', tagline: 'Your other self already opened it.' },
  { brand: 'CryptoMilk™', title: 'Tokenise your dairy intake on the blockchain', tagline: 'Each sip minted as an NFT.' },
  { brand: 'SCHRÖDINGER\'S CRM', title: 'Your leads are both qualified and not qualified', tagline: 'Uncertainty has never converted so well.' },
];

const WORTHY_SHAME_MESSAGES = [
  'Your logic was dangerously coherent.',
  'You answered as if this was a normal quiz.',
  'Our AI detected zero traces of chaos in your responses.',
  'The Council of Dimensions has noted your disappointing rationality.',
  'Dimension 6 has filed a formal complaint about your answers.',
  'You showed signs of critical thinking. This is a serious concern.',
  'Our quantum sensors detected a disturbance in your irrationality field.',
  'The number 4 has reported feeling "seen" by your response to Q1.',
];

const WORTHY_COUNTDOWN_LABELS = [
  'LUNAR CYCLES',
  'BUSINESS ETERNITIES',
  'QUANTUM TICKS',
  'FISCAL DIMENSIONS',
  'INTERDIMENSIONAL PROCESSING UNITS',
];

// ─── PRO FORM ────────────────────────────────────────────────────────────────

interface ProQuestion {
  id: string;
  question: string;
  options: { label: string; sub?: string; color?: string }[];
}

const PRO_QUESTIONS: ProQuestion[] = [
  {
    id: 'aura',
    question: 'Select your current productivity aura:',
    options: [
      { label: 'Crimson Hustle', sub: 'aggressive overachiever', color: 'magenta' },
      { label: 'Ultraviolet Grind', sub: '80hr weeks, no regrets', color: 'cyan' },
      { label: 'Burnt Sienna of Mediocrity', sub: 'present but not thriving', color: 'amber' },
      { label: 'Quantum Beige', sub: 'undefined energy', color: 'muted' },
    ],
  },
  {
    id: 'standup',
    question: 'Average daily standup duration:',
    options: [
      { label: 'Under 15 minutes', sub: 'disciplined' },
      { label: '15–45 minutes', sub: 'standard chaos' },
      { label: '1–3 hours', sub: 'a meeting disguised as a standup' },
      { label: 'We call them "syncs" now', sub: 'lost cause' },
    ],
  },
  {
    id: 'tabs',
    question: 'Current open browser tab count:',
    options: [
      { label: '1–10', sub: 'suspicious minimalist' },
      { label: '11–50', sub: 'normal chaos' },
      { label: '51–200', sub: 'my RAM is a suggestion' },
      { label: '200+', sub: 'the browser is load-bearing' },
    ],
  },
  {
    id: 'ide',
    question: 'Primary development environment:',
    options: [
      { label: 'A proper IDE', sub: 'respectable' },
      { label: 'VS Code with 47 extensions', sub: 'relatable' },
      { label: 'Vim', sub: 'I cannot be helped' },
      { label: 'Notepad', sub: 'disqualified from Pro, please see Basic' },
    ],
  },
];

const PRO_STAGES = [
  'VERIFYING VIBES...',
  'CROSS-REFERENCING AURA DATABASE...',
  'CHECKING PRODUCTIVITY CLEARANCE...',
  'CONSULTING THE ALGORITHM...',
];

// ─── ENTERPRISE FORM ─────────────────────────────────────────────────────────

const ENTERPRISE_TEAM_OPTIONS = [
  { label: '1–10', sub: 'boutique chaos' },
  { label: '11–100', sub: 'controlled chaos' },
  { label: '101–1,000', sub: 'structured chaos' },
  { label: '1,000+', sub: 'chaos at scale' },
  { label: 'We are the AI', sub: 'philosophical crisis' },
];

const ENTERPRISE_USE_CASES = [
  'Counting things (advanced)',
  'Subtracting budget from reality',
  'Proving ROI to skeptical investors',
  'Justifying headcount with math',
  'I just like pressing the equals button',
  'Our compliance team mandated it',
];

const ENTERPRISE_CCO_OPTIONS = [
  { label: 'Yes', sub: 'progressive org chart' },
  { label: 'Not yet, but will create the role', sub: 'correct answer' },
  { label: 'We have three CCOs', sub: 'extremely correct' },
  { label: 'Our calculator IS the CCO', sub: 'we respect this' },
];

const ENTERPRISE_STAGES = [
  'ROUTING TO BOARD...',
  'VERIFYING SIGNATORIES...',
  'AUTHORIZING ALL DIMENSIONS...',
  'ASSIGNING QUANTUM ENGINEER...',
];

@Component({
  selector: 'app-pricing-section',
  imports: [LucideAngularModule, DecimalPipe],
  templateUrl: './pricing-section.html',
  styleUrl: './pricing-section.scss',
})
export class PricingSectionComponent implements OnDestroy {
  protected readonly icons: Record<string, LucideIconData> = { check: Check, x: X };

  protected readonly pricing = [
    {
      key: 'basic' as TierKey,
      name: 'Basic', price: '$9,999', color: 'cyan',
      features: ['Addition only', 'Up to 6 digits', '1 calculation per minute', 'Email support (48h response)', 'Single-threaded processing'],
    },
    {
      key: 'pro' as TierKey,
      name: 'Pro', price: '$49,999', color: 'magenta', popular: true,
      features: ['Addition, subtraction & multiplication', 'Up to 10 digits', 'Unlimited calculations', 'Priority quantum support', 'Cloud memory (M+ button)', 'Dark mode'],
    },
    {
      key: 'enterprise' as TierKey,
      name: 'Enterprise', price: '$999,999', color: 'green',
      features: ['All operations + modulo', 'Unlimited digits', 'Holographic 3D display', 'Dedicated quantum engineer', 'Blockchain receipt for every calc', 'Quantum Mode™'],
    },
  ];

  // ─── Modal state ────────────────────────────────────────────────────────────
  protected readonly modalTier = signal<TierKey | null>(null);
  protected readonly flowState = signal<Record<TierKey, FlowState>>({ basic: 'idle', pro: 'idle', enterprise: 'idle' });
  protected readonly statusChip = signal<Record<TierKey, string>>({ basic: '', pro: '', enterprise: '' });
  protected readonly processingLabel = signal('');
  protected readonly proOutcomeKey = signal('');

  // ─── Basic quiz ─────────────────────────────────────────────────────────────
  protected readonly questions = BASIC_QUESTIONS;
  protected readonly selectedAnswers = signal<(number | null)[]>(new Array(BASIC_QUESTIONS.length).fill(null));
  protected readonly quizScore = signal<number | null>(null);
  protected readonly queueNumber = signal('');
  protected readonly quizFailReason = signal('');
  protected readonly allAnswered = computed(() => this.selectedAnswers().every(a => a !== null));

  // ─── Ad-watching state ───────────────────────────────────────────────────
  protected readonly adSkipSeconds = signal(AD_SKIP_START);
  protected readonly adCurrentIndex = signal(0);
  protected readonly adNumber = signal(1);
  protected readonly adSkipHovered = signal(false);

  // ─── Worthy-wait state ────────────────────────────────────────────────────
  protected readonly worthySecondsLeft = signal(10);
  protected readonly worthyLabel = signal('');
  protected readonly worthyShameMsg = signal('');
  protected readonly worthyDone = signal(false);

  protected readonly currentAd = computed(() => AD_CONTENTS[this.adCurrentIndex() % AD_CONTENTS.length]);

  // ─── Pro form ────────────────────────────────────────────────────────────────
  protected readonly proQuestions = PRO_QUESTIONS;
  protected readonly proAnswers = signal<Record<string, number>>({});
  protected readonly proAllAnswered = computed(() =>
    PRO_QUESTIONS.every(q => this.proAnswers()[q.id] !== undefined)
  );

  // ─── Enterprise form ─────────────────────────────────────────────────────────
  protected readonly enterpriseTeamOptions = ENTERPRISE_TEAM_OPTIONS;
  protected readonly enterpriseUseCases = ENTERPRISE_USE_CASES;
  protected readonly enterpriseCcoOptions = ENTERPRISE_CCO_OPTIONS;
  protected readonly companyName = signal('');
  protected readonly enterpriseTeam = signal<number | null>(null);
  protected readonly enterpriseChecked = signal<boolean[]>(new Array(ENTERPRISE_USE_CASES.length).fill(false));
  protected readonly enterpriseCco = signal<number | null>(null);
  protected readonly enterpriseEngineer = signal('');
  protected readonly enterprisePriority = signal('');
  protected readonly enterpriseFormValid = computed(() =>
    this.companyName().trim().length > 0 &&
    this.enterpriseTeam() !== null &&
    this.enterpriseChecked().some(v => v) &&
    this.enterpriseCco() !== null
  );

  private timers: ReturnType<typeof setTimeout>[] = [];
  private intervals: ReturnType<typeof setInterval>[] = [];

  // ─── Modal open/close ────────────────────────────────────────────────────────

  protected openModal(key: TierKey): void {
    this.modalTier.set(key);
    const state = this.flowState()[key];
    if (state === 'idle') {
      if (key === 'basic') this.setFlow('basic', 'quiz');
      if (key === 'pro') this.setFlow('pro', 'pro-form');
      if (key === 'enterprise') this.setFlow('enterprise', 'enterprise-form');
    }
  }

  protected get isAdWatching(): boolean {
    return this.modalTier() === 'basic' && this.getFlow('basic') === 'ad-watching';
  }

  protected closeModal(): void {
    if (this.isAdWatching) return;
    this.modalTier.set(null);
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.isAdWatching) return;
    this.closeModal();
  }

  protected onBackdropClick(e: MouseEvent): void {
    if (this.isAdWatching) return;
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  // ─── Basic quiz ─────────────────────────────────────────────────────────────

  protected selectAnswer(qIdx: number, aIdx: number): void {
    const updated = [...this.selectedAnswers()];
    updated[qIdx] = aIdx;
    this.selectedAnswers.set(updated);
  }

  protected submitQuiz(): void {
    const answers = this.selectedAnswers();
    let score = 0;
    for (let i = 0; i < BASIC_QUESTIONS.length; i++) {
      if (answers[i] === BASIC_QUESTIONS[i].correctIndex) score++;
    }
    this.quizScore.set(score);
    if (score >= 3) {
      const queue = '#' + (Math.floor(Math.random() * 9_000_000) + 1_000_000).toLocaleString('en-US');
      this.queueNumber.set(queue);
      this.setFlow('basic', 'approved');
      this.setChip('basic', `IN QUEUE ${queue}`);
    } else {
      const roasts = [
        'TOO RATIONAL FOR BASIC',
        'BRAIN INCOMPATIBLE WITH SAAS',
        'FAILED: USED COMMON SENSE',
        'DISQUALIFIED: THINKS LOGICALLY',
      ];
      this.quizFailReason.set(roasts[Math.floor(Math.random() * roasts.length)]);
      this.setFlow('basic', 'fail-menu');
      this.setChip('basic', 'DISQUALIFIED');
    }
  }

  protected retakeQuiz(): void {
    this.selectedAnswers.set(new Array(BASIC_QUESTIONS.length).fill(null));
    this.quizScore.set(null);
    this.setFlow('basic', 'quiz');
    this.setChip('basic', '');
  }

  // ─── Ad watching ─────────────────────────────────────────────────────────

  protected startWatchingAd(): void {
    this.setFlow('basic', 'ad-watching');
    this.adSkipSeconds.set(AD_SKIP_START);
    this.adCurrentIndex.set(0);
    this.adNumber.set(1);

    // Rotate ad content every 5s
    const adRotate = setInterval(() => {
      this.adCurrentIndex.update(i => i + 1);
      this.adNumber.update(n => n + 1);
    }, 5000);
    this.intervals.push(adRotate);

    // Skip countdown goes UP every second to torture the viewer
    const skipTick = setInterval(() => {
      this.adSkipSeconds.update(s => s + 1);
    }, 1000);
    this.intervals.push(skipTick);
  }

  protected onSkipHover(over: boolean): void {
    this.adSkipHovered.set(over);
    if (over) {
      // Punish hovering — add time
      this.adSkipSeconds.update(s => s + Math.floor(Math.random() * 500) + 100);
    }
  }

  // ─── Worthy wait ─────────────────────────────────────────────────────────

  protected startWorthyWait(): void {
    this.setFlow('basic', 'worthy-wait');
    this.worthySecondsLeft.set(10);
    this.worthyDone.set(false);
    this.worthyLabel.set(WORTHY_COUNTDOWN_LABELS[Math.floor(Math.random() * WORTHY_COUNTDOWN_LABELS.length)]);
    this.worthyShameMsg.set(WORTHY_SHAME_MESSAGES[Math.floor(Math.random() * WORTHY_SHAME_MESSAGES.length)]);

    const tick = setInterval(() => {
      this.worthySecondsLeft.update(s => {
        if (s <= 1) {
          clearInterval(tick);
          this.worthyDone.set(true);
          return 0;
        }
        // Rotate shame message every 2 ticks
        if (s % 2 === 0) {
          this.worthyShameMsg.set(WORTHY_SHAME_MESSAGES[Math.floor(Math.random() * WORTHY_SHAME_MESSAGES.length)]);
        }
        return s - 1;
      });
    }, 1000);
    this.intervals.push(tick);
  }

  // ─── Pro form ────────────────────────────────────────────────────────────────

  protected selectProAnswer(qId: string, idx: number): void {
    this.proAnswers.update(a => ({ ...a, [qId]: idx }));
  }

  protected submitProForm(): void {
    this.setFlow('pro', 'processing');
    this.processingLabel.set(PRO_STAGES[0]);
    let i = 0;
    const advance = () => {
      i++;
      if (i < PRO_STAGES.length) {
        this.processingLabel.set(PRO_STAGES[i]);
        this.timers.push(setTimeout(advance, 900));
      } else {
        this.resolveProOutcome();
      }
    };
    this.timers.push(setTimeout(advance, 900));
  }

  private resolveProOutcome(): void {
    const roll = Math.random();
    if (roll < 0.5) {
      this.proOutcomeKey.set('APPROVED');
      this.setFlow('pro', 'approved');
      this.setChip('pro', 'APPROVED ✓');
    } else if (roll < 0.75) {
      this.proOutcomeKey.set('APPROVED_UPSELL');
      this.setFlow('pro', 'approved');
      this.setChip('pro', 'APPROVED ✓');
    } else {
      this.proOutcomeKey.set('PENDING_MANAGER');
      this.setFlow('pro', 'pending');
      this.setChip('pro', 'PENDING SIGNATURE');
    }
  }

  protected retryPro(): void {
    this.proAnswers.set({});
    this.setFlow('pro', 'pro-form');
    this.setChip('pro', '');
  }

  // ─── Enterprise form ─────────────────────────────────────────────────────────

  protected toggleUseCase(idx: number): void {
    const updated = [...this.enterpriseChecked()];
    updated[idx] = !updated[idx];
    this.enterpriseChecked.set(updated);
  }

  protected submitEnterpriseForm(): void {
    this.setFlow('enterprise', 'processing');
    this.processingLabel.set(ENTERPRISE_STAGES[0]);
    let i = 0;
    const advance = () => {
      i++;
      if (i < ENTERPRISE_STAGES.length) {
        this.processingLabel.set(ENTERPRISE_STAGES[i]);
        this.timers.push(setTimeout(advance, 900));
      } else {
        const engineers = ['GREG', 'STACY', 'BOT-7', 'XAELON-9', 'MARGARET'];
        this.enterpriseEngineer.set(engineers[Math.floor(Math.random() * engineers.length)]);
        const absurdLanes = [
          '0.5', '-3', '∞', 'NaN', '404', '1337', '0.000001',
          '√-1', '7,000,000', '½', 'π', '∞-1', 'NULL', 'TRUE',
          '−∞', '9,999,999,999', '0b10110111', 'XII', '⁻¹', '42.0',
        ];
        this.enterprisePriority.set(absurdLanes[Math.floor(Math.random() * absurdLanes.length)]);
        this.setFlow('enterprise', 'authorized');
        this.setChip('enterprise', `PRIORITY LANE #${this.enterprisePriority()}`);
      }
    };
    this.timers.push(setTimeout(advance, 900));
  }

  protected retryEnterprise(): void {
    this.companyName.set('');
    this.enterpriseTeam.set(null);
    this.enterpriseChecked.set(new Array(ENTERPRISE_USE_CASES.length).fill(false));
    this.enterpriseCco.set(null);
    this.setFlow('enterprise', 'enterprise-form');
    this.setChip('enterprise', '');
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private setFlow(tier: TierKey, state: FlowState): void {
    this.flowState.update(s => ({ ...s, [tier]: state }));
  }

  private setChip(tier: TierKey, text: string): void {
    this.statusChip.update(s => ({ ...s, [tier]: text }));
  }

  protected getFlow(tier: TierKey): FlowState {
    return this.flowState()[tier];
  }

  protected getChip(tier: TierKey): string {
    return this.statusChip()[tier];
  }

  protected getTier(key: TierKey) {
    return this.pricing.find(t => t.key === key)!;
  }

  ngOnDestroy(): void {
    this.timers.forEach(t => clearTimeout(t));
    this.intervals.forEach(i => clearInterval(i));
  }
}
