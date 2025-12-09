import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { LayoutStore } from '../core/layout-store';
import { PlayerCard } from '../player-card/player-card';

@Component({
  selector: 'app-player-grid',
  imports: [PlayerCard, NgClass],
  templateUrl: './player-grid.html',
  styleUrl: './player-grid.css',
  host: {
    class: 'flex justify-center items-center p-1',
  },
})
export class PlayerGrid {
  private readonly layoutStore = inject(LayoutStore);

  protected readonly layout = this.layoutStore.layout.asReadonly();

  private readonly playerColorClasses = [
    '[&>mat-card]:bg-sky-400! dark:[&>mat-card]:bg-sky-700!',
    '[&>mat-card]:bg-green-400! dark:[&>mat-card]:bg-green-700!',
    '[&>mat-card]:bg-rose-400! dark:[&>mat-card]:bg-rose-700!',
    '[&>mat-card]:bg-violet-400! dark:[&>mat-card]:bg-violet-700!',
    '[&>mat-card]:bg-teal-400! dark:[&>mat-card]:bg-teal-700!',
    '[&>mat-card]:bg-yellow-400! dark:[&>mat-card]:bg-yellow-700!',
  ] as const;

  protected readonly players = computed(() =>
    Array.from({ length: this.layout().playerCount }, (_, index) => ({
      colorClass: this.playerColorClasses[index],
    }))
  );
}
