import { Component } from '@angular/core';
import { LucideAngularModule, Check, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-pricing-section',
  imports: [LucideAngularModule],
  templateUrl: './pricing-section.html',
  styleUrl: './pricing-section.scss',
})
export class PricingSectionComponent {
  protected readonly icons: Record<string, LucideIconData> = { check: Check };

  protected readonly pricing = [
    {
      name: 'Basic', price: '$9,999', color: 'cyan',
      features: ['Addition only', 'Up to 6 digits', '1 calculation per minute', 'Email support (48h response)', 'Single-threaded processing'],
    },
    {
      name: 'Pro', price: '$49,999', color: 'magenta', popular: true,
      features: ['Addition, subtraction & multiplication', 'Up to 10 digits', 'Unlimited calculations', 'Priority quantum support', 'Cloud memory (M+ button)', 'Dark mode'],
    },
    {
      name: 'Enterprise', price: '$999,999', color: 'green',
      features: ['All operations + modulo', 'Unlimited digits', 'Holographic 3D display', 'Dedicated quantum engineer', 'Blockchain receipt for every calc', 'Quantum Mode™'],
    },
  ];
}
