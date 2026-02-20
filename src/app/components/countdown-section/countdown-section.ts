import { Component, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-countdown-section',
  templateUrl: './countdown-section.html',
  styleUrl: './countdown-section.scss',
})
export class CountdownSectionComponent implements OnInit, OnDestroy {
  private readonly target = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  protected readonly display = signal({ days: '00', hours: '00', mins: '00', secs: '00' });
  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.update();
    this.timer = setInterval(() => this.update(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private update() {
    const diff = Math.max(0, this.target.getTime() - Date.now());
    this.display.set({
      days: String(Math.floor(diff / 86_400_000)).padStart(2, '0'),
      hours: String(Math.floor((diff % 86_400_000) / 3_600_000)).padStart(2, '0'),
      mins: String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0'),
      secs: String(Math.floor((diff % 60_000) / 1000)).padStart(2, '0'),
    });
  }
}
