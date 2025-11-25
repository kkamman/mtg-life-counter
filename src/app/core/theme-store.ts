import { effect, Injectable, signal } from '@angular/core';

export const themes = ['system', 'light', 'dark'] as const;

export type Theme = (typeof themes)[number];

@Injectable({
  providedIn: 'root',
})
export class ThemeStore {
  private readonly defaultTheme = 'system';
  private readonly localStorageKey = 'theme';

  public readonly theme = signal<Theme>(this.defaultTheme);

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
