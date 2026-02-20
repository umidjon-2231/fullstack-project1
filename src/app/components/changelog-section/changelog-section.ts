import { Component } from '@angular/core';

@Component({
  selector: 'app-changelog-section',
  templateUrl: './changelog-section.html',
  styleUrl: './changelog-section.scss',
})
export class ChangelogSectionComponent {
  protected readonly changelog = [
    { version: 'v1.0.0', note: 'Initial release. Numbers work now.' },
    { version: 'v0.9.8', note: 'Removed accidental sentience from equals button.' },
    { version: 'v0.9.5', note: 'Fixed bug where 7 × 8 returned "Thursday".' },
    { version: 'v0.9.2', note: 'Patched memory leak in M+ button (was storing in alternate dimension).' },
    { version: 'v0.8.0', note: 'Division added (required 14 additional quantum tunnels).' },
    { version: 'v0.7.3', note: 'Fixed equals button. Again.' },
    { version: 'v0.5.0', note: 'Subtraction support (controversial).' },
    { version: 'v0.1.0', note: 'Addition prototype. Only works with 2 and 3.' },
  ];
}
