import { effect, Injectable, signal } from '@angular/core';
import { z } from 'zod';

const Layout = z.object({
  isFlipped: z.boolean().default(false),
  playerCount: z.number().min(1).max(6).default(4),
});

const defaultLayout = Layout.parse({});

export type Layout = z.infer<typeof Layout>;

@Injectable({
  providedIn: 'root',
})
export class LayoutStore {
  private readonly _layout = signal<Layout>(defaultLayout);
  public readonly layout = this._layout.asReadonly();

  constructor() {
    this.syncLayoutWithLocalStorage();
  }

  public patchLayout(patch: Partial<Layout>) {
    this._layout.update((current) => Layout.parse({ ...current, ...patch }));
  }

  private syncLayoutWithLocalStorage() {
    const localStorageKey = 'LayoutStore';

    const localStorageJson = localStorage.getItem(localStorageKey);

    // Initialize the signal with the stored value if it is valid.
    if (localStorageJson !== null) {
      const parseResult = Layout.safeParse(JSON.parse(localStorageJson));

      if (parseResult.success) {
        this._layout.set(parseResult.data);
      }
    }

    // Keep local storage in sync with the signal.
    effect(() => localStorage.setItem(localStorageKey, JSON.stringify(this.layout())));
  }
}
