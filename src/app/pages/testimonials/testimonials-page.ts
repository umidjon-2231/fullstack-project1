import { Component } from '@angular/core';

import { CursorGlowComponent } from '../../components/cursor-glow/cursor-glow';
import { SiteFooterComponent } from '../../components/site-footer/site-footer';
import { TestimonialsSectionComponent } from '../../components/testimonials-section/testimonials-section';

@Component({
  selector: 'app-testimonials-page',
  imports: [CursorGlowComponent, TestimonialsSectionComponent, SiteFooterComponent],
  templateUrl: './testimonials-page.html',
  styleUrl: './testimonials-page.scss',
})
export class TestimonialsPage {}
