import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Menu, Sparkles, X, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  protected readonly mobileOpen = signal(false);

  protected readonly navItems = [
    { label: 'Home', path: '/' },
    { label: 'Preview', path: '/preview' },
    { label: 'Plans', path: '/plans' },
    { label: 'Team', path: '/team' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Changelog', path: '/changelog' },
    { label: 'Reviews', path: '/testimonials' },
  ];

  protected readonly icons: Record<string, LucideIconData> = {
    menu: Menu,
    close: X,
    sparkles: Sparkles,
  };

  protected toggleMenu() {
    this.mobileOpen.update(open => !open);
  }

  protected closeMenu() {
    this.mobileOpen.set(false);
  }

  protected isExact(path: string) {
    return path === '/';
  }
}
