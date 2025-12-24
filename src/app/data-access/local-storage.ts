import { effect, WritableSignal } from '@angular/core';
import { ZodType } from 'zod';

export const syncSignalWithLocalStorage = <T>(config: {
  signal: WritableSignal<T>;
  localStorageKey: string;
  schema: ZodType<T, unknown>;
}) => {
  const { signal, localStorageKey, schema } = config;

  const localStorageJson = localStorage.getItem(localStorageKey);

  // Initialize the signal with the stored value if it is valid.
  if (localStorageJson !== null) {
    let localStorageValue = null;

    try {
      localStorageValue = JSON.parse(localStorageJson);
    } catch {
      // Ignore the stored value.
    }

    const parseResult = schema.safeParse(localStorageValue);

    if (parseResult.success) {
      signal.set(parseResult.data);
    }
  }

  // Keep local storage in sync with the signal.
  effect(() => localStorage.setItem(localStorageKey, JSON.stringify(signal())));
};
