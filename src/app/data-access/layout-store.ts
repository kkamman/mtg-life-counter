import { Injectable, signal } from '@angular/core';
import { z } from 'zod';
import { syncSignalWithLocalStorage } from './local-storage';

const Layout = z.object({
  isFlipped: z.boolean().default(false),
  areLifeChangeIconsHidden: z.boolean().default(false),
  isCommanderDamageHidden: z.boolean().default(false),
  playerCount: z.number().min(1).max(6).default(4),
});

export type Layout = z.infer<typeof Layout>;

@Injectable({
  providedIn: 'root',
})
export class LayoutStore {
  private readonly _layout = signal<Layout>(Layout.parse({}));
  public readonly layout = this._layout.asReadonly();

  constructor() {
    syncSignalWithLocalStorage({
      signal: this._layout,
      localStorageKey: 'LayoutStore',
      schema: Layout,
    });
  }

  public patchLayout(patch: Partial<Layout>) {
    this._layout.update((current) => Layout.parse({ ...current, ...patch }));
  }
}
