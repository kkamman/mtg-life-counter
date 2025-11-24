import { Component } from '@angular/core';
import { PlayerGrid } from './player-grid/player-grid';

@Component({
  selector: 'app-root',
  imports: [PlayerGrid],
  templateUrl: './app.html',
})
export class App {}
