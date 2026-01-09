import { Component, computed, effect, inject, Renderer2 } from '@angular/core';
import { LayoutStore } from './data-access/layout-store';
import { ThemeStore } from './data-access/theme-store';
import { PlayerGrid } from './player-grid/player-grid';

@Component({
  selector: 'app-root',
  imports: [PlayerGrid],
  templateUrl: './app.html',
})
export class App {
  private readonly themeStore = inject(ThemeStore);
  private readonly layoutStore = inject(LayoutStore);
  private readonly renderer = inject(Renderer2);

  protected readonly isSinglePlayer = computed(() => this.layoutStore.layout().playerCount === 1);

  constructor() {
    effect(() => {
      const isDarkTheme =
        this.themeStore.theme() === 'dark' ||
        (this.themeStore.theme() === 'system' && this.themeStore.systemTheme === 'dark');

      if (isDarkTheme) {
        this.renderer.addClass(document.body, 'dark');
      } else {
        this.renderer.removeClass(document.body, 'dark');
      }
    });
  }
}
