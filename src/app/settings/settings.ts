import { Component, effect, inject, signal } from '@angular/core';
import { disabled, Field, form } from '@angular/forms/signals';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { LayoutStore } from '../core/layout-store';
import { ThemeStore } from '../core/theme-store';

@Component({
  selector: 'app-settings',
  imports: [MatRadioGroup, MatRadioButton, Field, MatSlideToggle, MatSlider, MatSliderThumb],
  templateUrl: './settings.html',
  host: {
    class: 'flex flex-col p-4 gap-4',
  },
})
export class Settings {
  private readonly themeStore = inject(ThemeStore);
  private readonly layoutStore = inject(LayoutStore);

  protected readonly settingsForm = form(
    signal({
      theme: this.themeStore.theme(),
      isFullscreen: document.fullscreenElement !== null,
      isFlippedLayout: this.layoutStore.layout().isFlipped,
      playerCount: this.layoutStore.layout().playerCount.toString(),
    }),
    (settings) => {
      if (!document.fullscreenEnabled) {
        disabled(settings.isFullscreen);
      }
    }
  );

  constructor() {
    effect(() => this.themeStore.theme.set(this.settingsForm.theme().value()));
    effect(() => {
      this.layoutStore.patchLayout({
        isFlipped: this.settingsForm.isFlippedLayout().value(),
        playerCount: parseInt(this.settingsForm.playerCount().value()),
      });
    });
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
