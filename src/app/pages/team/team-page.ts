import { Component } from '@angular/core';

import { CursorGlowComponent } from '../../components/cursor-glow/cursor-glow';
import { SiteFooterComponent } from '../../components/site-footer/site-footer';
import { TeamSectionComponent } from '../../components/team-section/team-section';

@Component({
  selector: 'app-team-page',
  imports: [CursorGlowComponent, TeamSectionComponent, SiteFooterComponent],
  templateUrl: './team-page.html',
  styleUrl: './team-page.scss',
})
export class TeamPage {}
