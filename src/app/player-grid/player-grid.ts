import { Component } from '@angular/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { PlayerCard } from '../player-card/player-card';

@Component({
  selector: 'app-player-grid',
  imports: [MatGridList, MatGridTile, PlayerCard, MatGridTile],
  templateUrl: './player-grid.html',
  host: {
    class: 'block',
  },
})
export class PlayerGrid {}
