import { Component } from '@angular/core';
import { LucideAngularModule, Atom, Brain, CloudSync, Link, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-features-section',
  imports: [LucideAngularModule],
  templateUrl: './features-section.html',
  styleUrl: './features-section.scss',
})
export class FeaturesSectionComponent {
  protected readonly icons: Record<string, LucideIconData> = {
    atom: Atom, brain: Brain, 'cloud-sync': CloudSync, link: Link,
  };

  protected readonly features = [
    { icon: 'atom', title: 'Quantum Number Processing', description: 'Every digit is processed through 14 parallel quantum tunnels for maximum numerical fidelity. Supports up to 3 dimensions of counting.' },
    { icon: 'brain', title: 'AI-Powered Equals Button', description: 'Our proprietary neural network predicts your answer 0.3 milliseconds before you press equals. Feels like time travel.' },
    { icon: 'cloud-sync', title: 'Cloud-Synced Memory', description: 'When you press M+, your number is stored across 7 global data centers. Your "14" has never been safer.' },
    { icon: 'link', title: 'Blockchain-Verified Results', description: 'Every calculation is minted as an NFT on CalcChain™. Finally, immutable proof that 2 + 2 = 4.' },
  ];
}
