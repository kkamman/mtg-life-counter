import { Component, inject } from '@angular/core';
import { LayoutStore } from '../core/layout-store';
import { PlayerCard } from '../player-card/player-card';

@Component({
  selector: 'app-player-grid',
  imports: [PlayerCard],
  templateUrl: './player-grid.html',
  host: {
    class: 'block',
  },
})
export class PlayerGrid {
  private readonly layoutStore = inject(LayoutStore);

  protected readonly layout = this.layoutStore.layout;
}
