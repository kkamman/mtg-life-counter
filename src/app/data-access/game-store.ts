import { computed, inject, Injectable, linkedSignal } from '@angular/core';
import { z } from 'zod';
import { Layout, LayoutStore } from './layout-store';
import { syncSignalWithLocalStorage } from './local-storage';

const CommanderDamage = z.array(z.number().min(0).max(999).default(0)).min(1).max(2).default([0]);

const GamePlayer = z.object({
  life: z.number().min(0).max(999).default(40),
  commanderDamage: z.array(CommanderDamage).default([]),
});

export type GamePlayer = z.infer<typeof GamePlayer>;

const Game = z.object({
  players: z.array(GamePlayer).default([]),
});

export type Game = z.infer<typeof Game>;

@Injectable({
  providedIn: 'root',
})
export class GameStore {
  private readonly layoutStore = inject(LayoutStore);

  private readonly _game = linkedSignal<Layout, Game>({
    source: this.layoutStore.layout,
    computation: (newLayout, previous) => {
      if (!previous) {
        return this.getInitialGameState(newLayout.playerCount);
      }

      const newGameState = { ...previous.value };

      if (newLayout.playerCount > newGameState.players.length) {
        newGameState.players = [
          ...newGameState.players,
          ...Array.from({ length: newLayout.playerCount - newGameState.players.length }, () =>
            GamePlayer.parse({}),
          ),
        ];
      }

      newGameState.players
        .filter((player) => player.commanderDamage.length < newLayout.playerCount)
        .forEach((player) => {
          player.commanderDamage = [
            ...player.commanderDamage,
            ...Array.from({ length: newLayout.playerCount - player.commanderDamage.length }, () =>
              CommanderDamage.parse(undefined),
            ),
          ];
        });

      return newGameState;
    },
  });

  public readonly game = computed(() => {
    const game = { ...this._game() };
    const playerCount = this.layoutStore.layout().playerCount;

    game.players = game.players.slice(0, playerCount).map((player) => ({
      ...player,
      commanderDamage: player.commanderDamage.slice(0, playerCount),
    }));

    return game;
  });

  constructor() {
    syncSignalWithLocalStorage({
      signal: this._game,
      localStorageKey: 'GameStore',
      schema: Game,
    });
  }

  public getPlayer(playerIndex: number) {
    return computed(() => this.game().players[playerIndex]);
  }

  public patchPlayer(playerIndex: number, patch: Partial<GamePlayer>) {
    this._game.update((game) => ({
      ...game,
      players: game.players.map((player, index) =>
        index === playerIndex ? GamePlayer.parse({ ...player, ...patch }) : player,
      ),
    }));
  }

  public reset() {
    this._game.set(this.getInitialGameState(this.layoutStore.layout().playerCount));
  }

  private getInitialGameState(playerCount: number) {
    return Game.parse({
      players: Array.from({ length: playerCount }, () => GamePlayer.parse({})).map((player) => ({
        ...player,
        commanderDamage: Array.from({ length: playerCount }, () =>
          CommanderDamage.parse(undefined),
        ),
      })),
    });
  }
}
