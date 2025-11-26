import { Component, effect, inject, Renderer2 } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { ThemeStore } from './core/theme-store';
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
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const isDarkTheme =
        this.themeStore.theme() === 'dark' ||
        (this.themeStore.theme() === 'system' && this.themeStore.systemTheme() === 'dark');

      if (isDarkTheme) {
        this.renderer.addClass(document.body, 'dark');
      } else {
        this.renderer.removeClass(document.body, 'dark');
      }
    });
  }
}
