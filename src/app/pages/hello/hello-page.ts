import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-hello-page',
  templateUrl: './hello-page.html',
  styleUrl: './hello-page.scss',
})
export class HelloPage {
  protected readonly name = signal('');
  protected readonly greetedName = signal('');
  protected readonly canGreet = computed(() => this.name().trim().length > 0);

  protected updateName(value: string): void {
    this.name.set(value);
  }

  protected greet(): void {
    const trimmedName = this.name().trim();

    if (!trimmedName) {
      return;
    }

    this.greetedName.set(trimmedName);
  }
}
