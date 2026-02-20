import { Component, DOCUMENT, inject, OnDestroy, AfterViewInit } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
  spin: number;
  drift: number;
  isCircle: boolean;
}

@Component({
  selector: 'app-confetti',
  template: '',
})
export class ConfettiComponent implements AfterViewInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);

  private canvas: HTMLCanvasElement | null = null;
  private animId: number | null = null;
  private particles: Particle[] = [];

  ngAfterViewInit(): void {
    this.launch();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private launch(): void {
    const w = this.doc.defaultView?.innerWidth ?? 1920;
    const h = this.doc.defaultView?.innerHeight ?? 1080;

    this.canvas = this.doc.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    Object.assign(this.canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '9998',
    });
    this.doc.body.appendChild(this.canvas);

    const colors = ['#00fff2', '#ff00e6', '#39ff14', '#ffaa00', '#ffffff'];
    this.particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * w,
      y: -10 - Math.random() * 150,
      size: 5 + Math.random() * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 2.5 + Math.random() * 4.5,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.18,
      drift: (Math.random() - 0.5) * 2.5,
      isCircle: Math.random() > 0.5,
    }));

    const ctx = this.canvas.getContext('2d')!;

    const tick = (): void => {
      ctx.clearRect(0, 0, w, h);
      let anyAlive = false;
      for (const p of this.particles) {
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        if (p.y < h + 20) anyAlive = true;
        const alpha = Math.max(0, 1 - p.y / (h * 1.05));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        if (p.isCircle) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }
        ctx.restore();
      }
      if (anyAlive) {
        this.animId = requestAnimationFrame(tick);
      } else {
        this.cleanup();
      }
    };

    this.animId = requestAnimationFrame(tick);
  }

  private cleanup(): void {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.canvas?.remove();
    this.canvas = null;
  }
}
