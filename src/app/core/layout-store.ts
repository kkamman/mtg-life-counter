import { effect, Injectable, signal } from '@angular/core';

export interface Layout {
  isFlipped: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutStore {
  private readonly localStorageKey = 'layout';

  public readonly layout = signal<Layout>({ isFlipped: true });

  constructor() {
    const localStorageLayout = this.readLayoutFromLocalStorage();
    if (localStorageLayout) {
      this.layout.set(localStorageLayout);
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
