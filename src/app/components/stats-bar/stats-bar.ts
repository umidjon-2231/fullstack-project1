import { AfterViewInit, Component, ElementRef, OnDestroy, signal, viewChild } from '@angular/core';
import { LucideAngularModule, Calculator, Target, Flame, Zap, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-stats-bar',
  imports: [LucideAngularModule],
  templateUrl: './stats-bar.html',
  styleUrl: './stats-bar.scss',
})
export class StatsBarComponent implements AfterViewInit, OnDestroy {
  protected readonly icons: Record<string, LucideIconData> = {
    calculator: Calculator, target: Target, flame: Flame, zap: Zap,
  };

  protected readonly statsRef = viewChild<ElementRef>('statsRef');
  protected readonly statsStarted = signal(false);
  protected readonly statDisplayValues = signal(['0', '0', '0', '0']);

  protected readonly stats = [
    { target: 14_200_000_000, suffix: '', decimals: 0, label: 'Calculations Performed', icon: 'calculator', live: true },
    { target: 99.97, suffix: '%', decimals: 2, label: 'Accuracy Rate', icon: 'target', live: false },
    { target: 0, suffix: '', decimals: 0, label: 'Explosions (so far)', icon: 'flame', live: false },
    { target: 47, suffix: '', decimals: 0, label: 'Quantum Tunnels Active', icon: 'zap', live: false },
  ];

  private statsObserver: IntersectionObserver | null = null;
  private liveCounterFrame = 0;
  private liveCount = 0;

  ngAfterViewInit() {
    const el = this.statsRef()?.nativeElement;
    if (el) {
      this.statsObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.statsStarted()) {
            this.statsStarted.set(true);
            this.animateStats();
            this.statsObserver?.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      this.statsObserver.observe(el);
    }
  }

  ngOnDestroy() {
    this.statsObserver?.disconnect();
    cancelAnimationFrame(this.liveCounterFrame);
  }

  private formatNumber(n: number): string {
    return Math.round(n).toLocaleString('en-US');
  }

  private animateStats() {
    const duration = 2500;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const values = this.stats.map(s => {
        const current = s.target * eased;
        if (s.decimals === 0 && !s.suffix) return this.formatNumber(current);
        return current.toFixed(s.decimals) + s.suffix;
      });
      this.statDisplayValues.set(values);
      if (progress < 1) requestAnimationFrame(tick);
      else { this.liveCount = this.stats[0].target; this.startLiveCounter(); }
    };
    requestAnimationFrame(tick);
  }

  private startLiveCounter() {
    let lastTime = performance.now();
    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      this.liveCount += delta * (3 + Math.random() * 5);
      this.statDisplayValues.update(vals => {
        const c = [...vals];
        c[0] = this.formatNumber(this.liveCount);
        return c;
      });
      this.liveCounterFrame = requestAnimationFrame(tick);
    };
    this.liveCounterFrame = requestAnimationFrame(tick);
  }
}
