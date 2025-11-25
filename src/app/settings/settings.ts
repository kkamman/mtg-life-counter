import { Component, effect, inject, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { ThemeStore } from '../core/theme-store';

interface SettingsData {
  theme: 'system' | 'light' | 'dark';
}

@Component({
  selector: 'app-settings',
  imports: [MatRadioGroup, MatRadioButton, Field],
  templateUrl: './settings.html',
  host: {
    class: 'block p-4',
  },
})
export class Settings {
  private readonly themeStore = inject(ThemeStore);

  private readonly settingsModel = signal<SettingsData>({
    theme: this.themeStore.theme(),
  });

  protected readonly settingsForm = form(this.settingsModel);

  constructor() {
    effect(() => this.themeStore.theme.set(this.settingsForm.theme().value()));
  }
}
