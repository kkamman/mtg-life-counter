import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { combineLatest, delay, map } from 'rxjs';

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
  protected readonly maxLife = Number.MAX_SAFE_INTEGER;
  protected readonly minLife = 0;

  public readonly life = signal(this.startingLife);

  private readonly lifeTextElement = viewChild.required<ElementRef>('lifeText');

  protected readonly lifeTextViewBox$ = combineLatest({
    lifeTextElement: toObservable(this.lifeTextElement),
    life: toObservable(this.life).pipe(delay(0)),
  }).pipe(
    map(({ lifeTextElement }) => {
      const bbox = lifeTextElement.nativeElement.getBBox() ?? new DOMRect();
      return [
        Math.round(bbox.x),
        Math.round(bbox.y),
        Math.round(bbox.width),
        Math.round(bbox.height),
      ].join(' ');
    })
  );

  protected removeLife() {
    this.life.update((count) => Math.max(count - 1, this.minLife));
  }

  protected addLife() {
    this.life.update((count) => Math.min(count + 1, this.maxLife));
  }
}
