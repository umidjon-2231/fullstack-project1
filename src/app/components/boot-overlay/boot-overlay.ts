import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { LucideAngularModule, Terminal, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-boot-overlay',
  imports: [LucideAngularModule],
  templateUrl: './boot-overlay.html',
  styleUrl: './boot-overlay.scss',
})
export class BootOverlayComponent implements OnInit, OnDestroy {
  protected readonly icons: Record<string, LucideIconData> = { terminal: Terminal };
  protected readonly showBoot = signal(true);
  protected readonly bootLines = signal<string[]>([]);
  private bootTimer: ReturnType<typeof setInterval> | null = null;

  private readonly bootSequence = [
    '[OK] Loading quantum drivers...',
    '[OK] Calibrating digit buffers...',
    '[OK] Establishing blockchain handshake...',
    '[OK] Warming up neural networks...',
    '[OK] Syncing cloud memory across 7 data centers...',
    '[OK] Verifying number stability...',
    '[WARN] Infinite division safety lock: ENGAGED',
    '[OK] CALCUL8R v1.0 ready. Welcome, human.',
  ];

  ngOnInit() {
    let i = 0;
    this.bootTimer = setInterval(() => {
      if (i < this.bootSequence.length) {
        this.bootLines.update(lines => [...lines, this.bootSequence[i]]);
        i++;
      } else {
        if (this.bootTimer) clearInterval(this.bootTimer);
        setTimeout(() => this.showBoot.set(false), 800);
      }
    }, 300);
  }

  ngOnDestroy() {
    if (this.bootTimer) clearInterval(this.bootTimer);
  }
}
