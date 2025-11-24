import { Component } from '@angular/core';
import { PlayerCard } from '../player-card/player-card';

@Component({
  selector: 'app-player-grid',
  imports: [PlayerCard],
  templateUrl: './player-grid.html',
  host: {
    class: 'block',
  },
})
export class PlayerGrid {}
