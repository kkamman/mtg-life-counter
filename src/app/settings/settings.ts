import { Component, effect, inject, signal } from '@angular/core';
import { disabled, Field, form } from '@angular/forms/signals';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ThemeStore } from '../core/theme-store';

interface SettingsData {
  theme: 'system' | 'light' | 'dark';
  isFullscreen: boolean;
}

@Component({
  selector: 'app-settings',
  imports: [MatRadioGroup, MatRadioButton, Field, MatSlideToggle],
  templateUrl: './settings.html',
  host: {
    class: 'flex flex-col p-4 gap-4',
  },
})
export class Settings {
  private readonly themeStore = inject(ThemeStore);

  private readonly settingsModel = signal<SettingsData>({
    theme: this.themeStore.theme(),
    isFullscreen: document.fullscreenElement !== null,
  });

  protected readonly settingsForm = form(this.settingsModel, (settings) => {
    if (!document.fullscreenEnabled) {
      disabled(settings.isFullscreen);
    }
  });

  constructor() {
    effect(() => this.themeStore.theme.set(this.settingsForm.theme().value()));
    this.updateIsFullscreenOnChange();
  }

  protected toggleFullscreen() {
    const isFullscreenRequested = this.settingsForm.isFullscreen().value();

    if (isFullscreenRequested !== this.isFullscreenOpen()) {
      isFullscreenRequested ? document.body.requestFullscreen() : document.exitFullscreen();
    }
  }

  private updateIsFullscreenOnChange() {
    const updateFn = () => this.settingsForm.isFullscreen().value.set(this.isFullscreenOpen());

    document.body.addEventListener('fullscreenchange', updateFn);
    document.body.addEventListener('fullscreenerror', updateFn);
  }

  private isFullscreenOpen() {
    return document.fullscreenElement !== null;
  }
}
