import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-cursor-glow',
  template: `<div class="cursor-glow" [style.left.px]="mouseX()" [style.top.px]="mouseY()"></div>`,
  styleUrl: './cursor-glow.scss',
  host: { '(window:mousemove)': 'onMove($event)' },
})
export class CursorGlowComponent {
  protected readonly mouseX = signal(-300);
  protected readonly mouseY = signal(-300);

  onMove(e: MouseEvent) {
    this.mouseX.set(e.clientX);
    this.mouseY.set(e.clientY);
  }
}
