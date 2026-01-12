import { Component, computed, effect, inject, Renderer2 } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, fromEvent, iif, merge, of, switchMap } from 'rxjs';
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

  private readonly wakeLock = toSignal(
    iif(() => 'wakeLock' in navigator, navigator.wakeLock.request('screen'), of(null)).pipe(
      filter((wakeLock) => !!wakeLock),
      switchMap((wakeLock) =>
        merge(
          of(wakeLock),
          fromEvent(document, 'visibilitychange').pipe(
            filter(() => document.visibilityState === 'visible'),
            switchMap(() => navigator.wakeLock.request('screen')),
          ),
        ),
      ),
    ),
  );

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
