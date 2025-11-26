import { MediaMatcher } from '@angular/cdk/layout';
import { effect, inject, Injectable, signal } from '@angular/core';

export const themes = ['system', 'light', 'dark'] as const;

export type Theme = (typeof themes)[number];

@Injectable({
  providedIn: 'root',
})
export class ThemeStore {
  private readonly defaultTheme = 'system';
  private readonly localStorageKey = 'theme';

  private readonly mediaMatcher = inject(MediaMatcher);

  public readonly theme = signal<Theme>(this.defaultTheme);

  public readonly systemTheme = signal<Exclude<Theme, 'system'>>(
    this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  constructor() {
    this.theme.set(this.readThemeFromLocalStorage() ?? this.defaultTheme);
    effect(() => this.saveThemeToLocalStorage(this.theme()));
  }

  private saveThemeToLocalStorage(theme: Theme) {
    localStorage.setItem(this.localStorageKey, theme);
  }

  private readThemeFromLocalStorage() {
    const storedTheme = localStorage.getItem(this.localStorageKey);
    return this.isValidTheme(storedTheme) ? storedTheme : null;
  }

  private isValidTheme(theme: string | null | undefined): theme is Theme {
    const validThemes: ReadonlyArray<string | null | undefined> = themes;
    return validThemes.includes(theme);
  }
}
