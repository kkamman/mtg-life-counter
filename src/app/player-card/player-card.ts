import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  concat,
  delay,
  map,
  of,
  pairwise,
  repeat,
  scan,
  startWith,
  switchMap,
  takeWhile,
} from 'rxjs';
import { GameStore } from '../data-access/game-store';

@Component({
  selector: 'app-player-card',
  imports: [MatCard, MatIconButton, MatIcon],
  templateUrl: './player-card.html',
  host: {
    class: 'block',
  },
})
export class PlayerCard {
  public readonly playerIndex = input.required<number>();

  private readonly gameStore = inject(GameStore);

  protected readonly maxLife = 999;
  protected readonly minLife = 0;

  protected readonly player = computed(() => this.gameStore.getPlayer(this.playerIndex())());

  protected readonly lifeChange = toSignal(
    toObservable(this.player).pipe(
      map((player) => player.life),
      pairwise(),
      scan((acc, curr) => acc + (curr[1] - curr[0]), 0),
      switchMap((x) => concat(of(x), of(0, null).pipe(delay(3000)))),
      takeWhile((x) => x != null),
      map((x) => (x > 0 ? `+${x}` : x)),
      repeat(),
      startWith(0)
    )
  );

  protected removeLife() {
    this.gameStore.patchPlayer(this.playerIndex(), {
      life: Math.max(this.player().life - 1, this.minLife),
    });
  }

  protected addLife() {
    this.gameStore.patchPlayer(this.playerIndex(), {
      life: Math.min(this.player().life + 1, this.maxLife),
    });
  }
}
