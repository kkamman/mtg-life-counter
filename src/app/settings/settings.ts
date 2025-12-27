import { Component, effect, inject, signal } from '@angular/core';
import { disabled, Field, form } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { GameStore } from '../data-access/game-store';
import { LayoutStore } from '../data-access/layout-store';
import { ThemeStore } from '../data-access/theme-store';

@Component({
  selector: 'app-settings',
  imports: [
    MatRadioGroup,
    MatRadioButton,
    Field,
    MatSlideToggle,
    MatSlider,
    MatSliderThumb,
    MatButton,
  ],
  templateUrl: './settings.html',
  host: {
    class: 'flex flex-col p-4 gap-4',
  },
})
export class Settings {
  private readonly themeStore = inject(ThemeStore);
  private readonly layoutStore = inject(LayoutStore);
  private readonly gameStore = inject(GameStore);

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
    },
  );

  constructor() {
    effect(() => this.themeStore.setTheme(this.settingsForm.theme().value()));
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

  protected resetGame() {
    this.gameStore.reset();
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
