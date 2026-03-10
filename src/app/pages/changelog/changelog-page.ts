import { Component } from '@angular/core';

import { ChangelogSectionComponent } from '../../components/changelog-section/changelog-section';
import { CursorGlowComponent } from '../../components/cursor-glow/cursor-glow';
import { SiteFooterComponent } from '../../components/site-footer/site-footer';

@Component({
  selector: 'app-changelog-page',
  imports: [CursorGlowComponent, ChangelogSectionComponent, SiteFooterComponent],
  templateUrl: './changelog-page.html',
  styleUrl: './changelog-page.scss',
})
export class ChangelogPage {}
