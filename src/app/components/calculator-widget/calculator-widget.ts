import { Component, computed, HostListener, OnDestroy, output, signal } from '@angular/core';
import { LucideAngularModule, Keyboard, Clock, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-calculator-widget',
  imports: [LucideAngularModule],
  templateUrl: './calculator-widget.html',
  styleUrl: './calculator-widget.scss',
})
export class CalculatorWidgetComponent implements OnDestroy {
  protected readonly icons: Record<string, LucideIconData> = { keyboard: Keyboard, clock: Clock };

  readonly confettiTrigger = output<void>();

  // ── Display state ──────────────────────────────────────
  protected readonly display = signal('0');
  protected readonly previousOperand = signal<number | null>(null);
  protected readonly currentOperator = signal<string | null>(null);
  protected readonly waitingForOperand = signal(false);
  protected readonly lastExpression = signal('');
  protected readonly easterEgg = signal('');
  protected readonly divideByZeroGlitch = signal(false);

  protected readonly displayFormatted = computed(() => {
    const val = this.display();
    if (val.includes('.') && val.endsWith('.')) return val;
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    if (val.includes('.')) {
      const [intPart, decPart] = val.split('.');
      return parseFloat(intPart).toLocaleString('en-US') + '.' + decPart;
    }
    return num.toLocaleString('en-US');
  });

  // ── History tape ───────────────────────────────────────
  protected readonly history = signal<{ expression: string; result: string }[]>([]);

  // ── Buttons ────────────────────────────────────────────
  protected readonly buttons = [
    { label: 'AC', type: 'function', action: () => this.clear() },
    { label: '+/−', type: 'function', action: () => this.toggleSign() },
    { label: '%', type: 'function', action: () => this.percentage() },
    { label: '÷', type: 'operator', action: () => this.inputOperator('/') },
    { label: '7', type: 'digit', action: () => this.inputDigit('7') },
    { label: '8', type: 'digit', action: () => this.inputDigit('8') },
    { label: '9', type: 'digit', action: () => this.inputDigit('9') },
    { label: '×', type: 'operator', action: () => this.inputOperator('*') },
    { label: '4', type: 'digit', action: () => this.inputDigit('4') },
    { label: '5', type: 'digit', action: () => this.inputDigit('5') },
    { label: '6', type: 'digit', action: () => this.inputDigit('6') },
    { label: '−', type: 'operator', action: () => this.inputOperator('-') },
    { label: '1', type: 'digit', action: () => this.inputDigit('1') },
    { label: '2', type: 'digit', action: () => this.inputDigit('2') },
    { label: '3', type: 'digit', action: () => this.inputDigit('3') },
    { label: '+', type: 'operator', action: () => this.inputOperator('+') },
    { label: '0', type: 'digit zero', action: () => this.inputDigit('0') },
    { label: '.', type: 'digit', action: () => this.inputDigit('.') },
    { label: '=', type: 'equals', action: () => this.equals() },
  ];

  ngOnDestroy() {
    if (this.glitchTimeout) clearTimeout(this.glitchTimeout);
  }

  private glitchTimeout: ReturnType<typeof setTimeout> | null = null;

  // ── Keyboard support ───────────────────────────────────
  @HostListener('window:keydown', ['$event'])
  handleKey(e: KeyboardEvent) {
    if (e.key >= '0' && e.key <= '9') { this.inputDigit(e.key); e.preventDefault(); }
    else if (e.key === '.') { this.inputDigit('.'); e.preventDefault(); }
    else if (e.key === '+') { this.inputOperator('+'); e.preventDefault(); }
    else if (e.key === '-') { this.inputOperator('-'); e.preventDefault(); }
    else if (e.key === '*') { this.inputOperator('*'); e.preventDefault(); }
    else if (e.key === '/') { this.inputOperator('/'); e.preventDefault(); }
    else if (e.key === 'Enter' || e.key === '=') { this.equals(); e.preventDefault(); }
    else if (e.key === 'Escape' || e.key === 'Delete') { this.clear(); e.preventDefault(); }
    else if (e.key === 'Backspace') { this.backspace(); e.preventDefault(); }
    else if (e.key === '%') { this.percentage(); e.preventDefault(); }
  }

  // ── Calculator methods ─────────────────────────────────
  inputDigit(digit: string) {
    if (digit === '.') {
      if (this.display().includes('.')) return;
      if (this.waitingForOperand()) { this.display.set('0.'); this.waitingForOperand.set(false); return; }
      this.display.update(d => d + '.');
      return;
    }
    if (this.waitingForOperand()) { this.display.set(digit); this.waitingForOperand.set(false); return; }
    this.display.update(d => (d === '0' ? digit : d + digit));
    this.checkEasterEgg();
  }

  inputOperator(operator: string) {
    const current = parseFloat(this.display());
    if (this.previousOperand() !== null && !this.waitingForOperand()) {
      const result = this.calculate(this.previousOperand()!, this.currentOperator()!, current);
      this.display.set(String(result));
      this.previousOperand.set(result);
    } else {
      this.previousOperand.set(current);
    }
    const opSymbol = operator === '*' ? '×' : operator === '/' ? '÷' : operator === '-' ? '−' : operator;
    this.lastExpression.set(`${this.display()} ${opSymbol}`);
    this.currentOperator.set(operator);
    this.waitingForOperand.set(true);
  }

  equals() {
    if (this.previousOperand() === null || this.currentOperator() === null) return;
    const current = parseFloat(this.display());

    if (this.currentOperator() === '/' && current === 0) {
      this.divideByZeroGlitch.set(true);
      this.easterEgg.set('QUANTUM INSTABILITY DETECTED');
      this.glitchTimeout = setTimeout(() => this.divideByZeroGlitch.set(false), 1500);
      this.display.set('ERR');
      const expr = `${this.previousOperand()} ÷ 0`;
      this.history.update(h => [{ expression: expr, result: 'ERR' }, ...h].slice(0, 20));
      this.lastExpression.set('');
      this.previousOperand.set(null);
      this.currentOperator.set(null);
      this.waitingForOperand.set(false);
      return;
    }

    const result = this.calculate(this.previousOperand()!, this.currentOperator()!, current);
    const opSymbol = this.currentOperator() === '*' ? '×' : this.currentOperator() === '/' ? '÷' : this.currentOperator() === '-' ? '−' : this.currentOperator()!;
    const expr = `${this.previousOperand()} ${opSymbol} ${current}`;
    this.history.update(h => [{ expression: expr, result: String(result) }, ...h].slice(0, 20));
    this.display.set(String(result));
    this.lastExpression.set('');
    this.previousOperand.set(null);
    this.currentOperator.set(null);
    this.waitingForOperand.set(false);
    this.checkEasterEgg();
    this.checkConfetti(result);
  }

  clear() {
    this.display.set('0');
    this.previousOperand.set(null);
    this.currentOperator.set(null);
    this.waitingForOperand.set(false);
    this.lastExpression.set('');
    this.easterEgg.set('');
  }

  toggleSign() {
    const current = parseFloat(this.display());
    if (current !== 0) this.display.set(String(-current));
  }

  percentage() {
    const current = parseFloat(this.display());
    this.display.set(String(current / 100));
  }

  backspace() {
    const d = this.display();
    if (d === 'ERR') { this.clear(); return; }
    if (d.length === 1 || (d.length === 2 && d.startsWith('-'))) this.display.set('0');
    else this.display.update(v => v.slice(0, -1));
  }

  // ── Private helpers ────────────────────────────────────
  private calculate(a: number, operator: string, b: number): number {
    let result: number;
    switch (operator) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b !== 0 ? a / b : 0; break;
      default: result = b;
    }
    return parseFloat(result.toPrecision(12));
  }

  private checkEasterEgg() {
    const val = this.display();
    if (val === '42') this.easterEgg.set('THE ANSWER TO EVERYTHING');
    else if (val === '1337') this.easterEgg.set('LEET MODE ACTIVATED');
    else if (val === '404') this.easterEgg.set('NUMBER NOT FOUND');
    else if (val === '666') this.easterEgg.set('DEMONIC CALCULATION DETECTED');
    else if (val === '314' || val === '3.14159') this.easterEgg.set('MMMMM... PIE');
    else this.easterEgg.set('');
  }

  private checkConfetti(result: number) {
    if (result === 69 || result === 420 || result === 1337 || result === 42) {
      this.confettiTrigger.emit();
    }
  }
}
