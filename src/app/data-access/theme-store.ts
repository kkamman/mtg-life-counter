import { MediaMatcher } from '@angular/cdk/layout';
import { inject, Injectable, signal } from '@angular/core';
import { z } from 'zod';
import { syncSignalWithLocalStorage } from './local-storage';

const Theme = z.enum(['system', 'light', 'dark']).default('system');

export type Theme = z.infer<typeof Theme>;

@Injectable({
  providedIn: 'root',
})
export class ThemeStore {
  private readonly mediaMatcher = inject(MediaMatcher);

  private readonly _theme = signal<Theme>('system');
  public readonly theme = this._theme.asReadonly();

  public readonly systemTheme = this.getSystemTheme();

  constructor() {
    syncSignalWithLocalStorage({
      signal: this._theme,
      localStorageKey: 'ThemeStore',
      schema: Theme,
    });
  }

  public setTheme(theme: Theme) {
    this._theme.set(theme);
  }

  private getSystemTheme(): Exclude<Theme, 'system'> {
    const darkThemeMediaQuery = this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)');
    return darkThemeMediaQuery.matches ? 'dark' : 'light';
  }
}
