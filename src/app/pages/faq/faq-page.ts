import { Component } from '@angular/core';

import { CursorGlowComponent } from '../../components/cursor-glow/cursor-glow';
import { FaqSectionComponent } from '../../components/faq-section/faq-section';
import { SiteFooterComponent } from '../../components/site-footer/site-footer';

@Component({
  selector: 'app-faq-page',
  imports: [CursorGlowComponent, FaqSectionComponent, SiteFooterComponent],
  templateUrl: './faq-page.html',
  styleUrl: './faq-page.scss',
})
export class FaqPage {}
