import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Language, PreferencesService, Theme } from './services/preferences.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly preferences = inject(PreferencesService);

  open(dialog: HTMLDialogElement): void {
    dialog.showModal();
  }

  closeOnBackdrop(event: MouseEvent, dialog: HTMLDialogElement): void {
    if (event.target === dialog) dialog.close();
  }

  setLanguage(value: string): void {
    this.preferences.setLanguage(value as Language);
  }

  setTheme(theme: Theme): void {
    this.preferences.setTheme(theme);
  }
}
