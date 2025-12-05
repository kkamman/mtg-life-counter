import { Component, signal } from '@angular/core';
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

@Component({
  selector: 'app-player-card',
  imports: [MatCard, MatIconButton, MatIcon],
  templateUrl: './player-card.html',
  host: {
    class: 'block',
  },
})
export class PlayerCard {
  protected readonly startingLife = 40;
  protected readonly maxLife = 999;
  protected readonly minLife = 0;

  protected readonly life = signal(this.startingLife);

  protected readonly lifeChange = toSignal(
    toObservable(this.life).pipe(
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
    this.life.update((count) => Math.max(count - 1, this.minLife));
  }

  protected addLife() {
    this.life.update((count) => Math.min(count + 1, this.maxLife));
  }
}
