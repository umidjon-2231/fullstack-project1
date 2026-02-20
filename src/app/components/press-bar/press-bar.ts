import { Component } from '@angular/core';

@Component({
  selector: 'app-press-bar',
  templateUrl: './press-bar.html',
  styleUrl: './press-bar.scss',
})
export class PressBarComponent {
  protected readonly logos = [
    'Quantum Times', 'The Daily Integer', 'Wired (to an abacus)',
    'TechCrunch Numbers', 'The Arithmetic Post', 'Binary Insider',
  ];
}
