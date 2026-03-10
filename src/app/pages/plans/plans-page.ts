import { Component } from '@angular/core';

import { CursorGlowComponent } from '../../components/cursor-glow/cursor-glow';
import { PricingSectionComponent } from '../../components/pricing-section/pricing-section';
import { SiteFooterComponent } from '../../components/site-footer/site-footer';

@Component({
  selector: 'app-plans-page',
  imports: [CursorGlowComponent, PricingSectionComponent, SiteFooterComponent],
  templateUrl: './plans-page.html',
  styleUrl: './plans-page.scss',
})
export class PlansPage {}
