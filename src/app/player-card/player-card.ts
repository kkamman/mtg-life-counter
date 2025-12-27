import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
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
import { LayoutStore } from '../data-access/layout-store';

interface CommanderDamageSource {
  playerIndex: number;
  commanderIndex: number;
}

@Component({
  selector: 'app-player-card',
  imports: [MatCard, MatIconButton, MatIcon, MatButton],
  templateUrl: './player-card.html',
  host: {
    class: 'block',
  },
})
export class PlayerCard {
  public readonly playerIndex = input.required<number>();

  private readonly gameStore = inject(GameStore);
  private readonly layoutStore = inject(LayoutStore);

  protected readonly maxLife = 999;
  protected readonly minLife = 0;

  protected readonly player = computed(() => this.gameStore.getPlayer(this.playerIndex())());

  protected readonly layout = this.layoutStore.layout;

  protected readonly lifeChange = toSignal(
    toObservable(this.player).pipe(
      map((player) => player.life),
      pairwise(),
      scan((acc, curr) => acc + (curr[1] - curr[0]), 0),
      switchMap((x) => concat(of(x), of(0, null).pipe(delay(3000)))),
      takeWhile((x) => x != null),
      map((x) => (x > 0 ? `+${x}` : x)),
      repeat(),
      startWith(0),
    ),
  );

  protected readonly commanderDamageSource = signal<CommanderDamageSource | undefined>(undefined);

  protected removeLife() {
    let playerCommanderDamage = [...this.player().commanderDamage];

    const commanderDamageSource = this.commanderDamageSource();

    if (commanderDamageSource) {
      playerCommanderDamage = playerCommanderDamage.map((commanderDamage, playerIndex) =>
        playerIndex === commanderDamageSource.playerIndex
          ? commanderDamage.map((damage, commanderIndex) =>
              commanderIndex === commanderDamageSource.commanderIndex ? damage + 1 : damage,
            )
          : commanderDamage,
      );
    }

    this.gameStore.patchPlayer(this.playerIndex(), {
      life: Math.max(this.player().life - 1, this.minLife),
      commanderDamage: playerCommanderDamage,
    });
  }

  protected addLife() {
    let playerCommanderDamage = [...this.player().commanderDamage];

    const commanderDamageSource = this.commanderDamageSource();

    if (commanderDamageSource) {
      playerCommanderDamage = playerCommanderDamage.map((commanderDamage, playerIndex) =>
        playerIndex === commanderDamageSource.playerIndex
          ? commanderDamage.map((damage, commanderIndex) =>
              commanderIndex === commanderDamageSource.commanderIndex ? damage - 1 : damage,
            )
          : commanderDamage,
      );
    }

    this.gameStore.patchPlayer(this.playerIndex(), {
      life: Math.min(this.player().life + 1, this.maxLife),
      commanderDamage: playerCommanderDamage,
    });
  }

  protected toggleCommanderDamageSource(source: CommanderDamageSource) {
    this.commanderDamageSource.update((current) =>
      this.isCommanderDamageSourceEqual(current, source) ? undefined : source,
    );
  }

  protected getCommanderDamageForSource(source: CommanderDamageSource) {
    return this.player().commanderDamage[source.playerIndex][source.commanderIndex];
  }

  protected isCommanderDamageSourceEqual(
    a: CommanderDamageSource | undefined,
    b: CommanderDamageSource | undefined,
  ) {
    return a?.playerIndex === b?.playerIndex && a?.commanderIndex === b?.commanderIndex;
  }
}
