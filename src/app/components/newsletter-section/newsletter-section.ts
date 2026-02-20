import { Component, signal } from '@angular/core';
import { LucideAngularModule, Mail, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-newsletter-section',
  imports: [LucideAngularModule],
  templateUrl: './newsletter-section.html',
  styleUrl: './newsletter-section.scss',
})
export class NewsletterSectionComponent {
  protected readonly icons: Record<string, LucideIconData> = { mail: Mail };

  protected readonly email = signal('');
  protected readonly submitted = signal(false);

  submit() {
    if (this.email()) {
      this.submitted.set(true);
      this.email.set('');
    }
  }
}
