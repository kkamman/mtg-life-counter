import { Component, effect, inject, signal } from '@angular/core';
import { disabled, Field, form } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { GameStore } from '../data-access/game-store';
import { LayoutStore } from '../data-access/layout-store';
import { ThemeStore } from '../data-access/theme-store';
import { FullscreenToggler } from '../fullscreen-toggler';

@Component({
  selector: 'app-settings-dialog',
  imports: [
    MatRadioGroup,
    MatRadioButton,
    Field,
    MatSlideToggle,
    MatSlider,
    MatSliderThumb,
    MatButton,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './settings-dialog.html',
  host: {
    class: 'flex flex-col p-4 gap-4',
  },
})
export class SettingsDialog {
  private readonly themeStore = inject(ThemeStore);
  private readonly layoutStore = inject(LayoutStore);
  private readonly gameStore = inject(GameStore);
  private readonly fullscreenToggler = inject(FullscreenToggler);

  protected readonly settingsForm = form(
    signal({
      theme: this.themeStore.theme(),
      isFullscreen: document.fullscreenElement !== null,
      isFlippedLayout: this.layoutStore.layout().isFlipped,
      areLifeChangeIconsHidden: this.layoutStore.layout().areLifeChangeIconsHidden,
      isCommanderDamageHidden: this.layoutStore.layout().isCommanderDamageHidden,
      playerCount: this.layoutStore.layout().playerCount.toString(),
    }),
    (settings) => {
      disabled(settings.isFullscreen, () => !this.fullscreenToggler.canFullscreenBeToggled());
    },
  );

  constructor() {
    effect(() => this.themeStore.setTheme(this.settingsForm.theme().value()));

    effect(() => {
      this.layoutStore.patchLayout({
        isFlipped: this.settingsForm.isFlippedLayout().value(),
        areLifeChangeIconsHidden: this.settingsForm.areLifeChangeIconsHidden().value(),
        isCommanderDamageHidden: this.settingsForm.isCommanderDamageHidden().value(),
        playerCount: parseInt(this.settingsForm.playerCount().value()),
      });
    });

    effect(() =>
      this.settingsForm.isFullscreen().value.set(this.fullscreenToggler.isFullscreenOpen()),
    );
  }

  protected toggleFullscreen() {
    this.fullscreenToggler.toggleFullscreen();
  }

  protected resetGame() {
    this.gameStore.reset();
  }
}
