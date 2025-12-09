import { effect, Injectable, signal } from '@angular/core';

export interface Layout {
  isFlipped: boolean;
  playerCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutStore {
  private readonly localStorageKey = 'layout';

  public readonly layout = signal<Layout>({ isFlipped: true, playerCount: 4 });

  constructor() {
    const localStorageLayout = this.readLayoutFromLocalStorage();
    if (localStorageLayout) {
      this.layout.update((layout) => ({ ...layout, ...localStorageLayout }));
    }
    effect(() => this.saveLayoutToLocalStorage(this.layout()));
  }

  private saveLayoutToLocalStorage(layout: Layout) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(layout));
  }

  // TODO: use zod
  private readLayoutFromLocalStorage(): Layout | null {
    const localStorageValue = localStorage.getItem(this.localStorageKey);
    return localStorageValue !== null ? JSON.parse(localStorageValue) : null;
  }
}
