import { AsyncPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-player-card',
  imports: [MatCard, MatIconButton, MatIcon, AsyncPipe],
  templateUrl: './player-card.html',
  host: {
    class: 'block',
  },
})
export class PlayerCard {
  protected readonly startingLife = 40;
  protected readonly maxLife = 999;
  protected readonly minLife = 0;

  public readonly life = signal(this.startingLife);

  protected removeLife() {
    this.life.update((count) => Math.max(count - 1, this.minLife));
  }

  protected addLife() {
    this.life.update((count) => Math.min(count + 1, this.maxLife));
  }
}
