import { Component, DOCUMENT, effect, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { Theme, ThemeStore } from './core/theme-store';
import { PlayerGrid } from './player-grid/player-grid';
import { Settings } from './settings/settings';

@Component({
  selector: 'app-root',
  imports: [
    PlayerGrid,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatIconButton,
    MatIcon,
    Settings,
  ],
  templateUrl: './app.html',
})
export class App {
  private readonly themeStore = inject(ThemeStore);
  private readonly document = inject(DOCUMENT);

  constructor() {
    effect(() => this.applyTheme(this.themeStore.theme()));
  }

  private applyTheme(theme: Theme) {
    const classesByTheme = {
      system: null,
      light: 'scheme-light!',
      dark: 'scheme-dark!',
    } as const;

    // Remove existing theme
    Object.values(classesByTheme)
      .filter((themeClass) => themeClass != null)
      .forEach((themeClass) => this.document.body.classList.remove(themeClass));

    const themeClass = classesByTheme[theme];

    // Apply new theme
    if (themeClass) {
      this.document.body.classList.add(themeClass);
    }
  }
}
