import { Component } from '@angular/core';

@Component({
  selector: 'app-team-section',
  templateUrl: './team-section.html',
  styleUrl: './team-section.scss',
})
export class TeamSectionComponent {
  protected readonly team = [
    { name: 'Dr. Elara Voss', title: 'Chief Number Officer', initial: 'E', color: 'cyan' },
    { name: 'Jim Tanaka', title: 'VP of Addition', initial: 'J', color: 'magenta' },
    { name: 'Priya Sharma', title: 'Senior Subtraction Architect', initial: 'P', color: 'green' },
    { name: 'Oleg Petrov', title: 'Head of Counting (Interim)', initial: 'O', color: 'amber' },
  ];
}
