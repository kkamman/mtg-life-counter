import { MediaMatcher } from '@angular/cdk/layout';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map, merge, startWith } from 'rxjs';

export type FullscreenSource = 'browser' | 'fullscreen-api';

@Injectable({
  providedIn: 'root',
})
export class FullscreenToggler {
  private readonly mediaMatcher = inject(MediaMatcher);

  private readonly browserFullscreenMediaQuery = this.mediaMatcher.matchMedia(
    '(display-mode: fullscreen)',
  );

  private readonly fullscreenDisplayModeChange$ = fromEvent<MediaQueryListEvent>(
    this.browserFullscreenMediaQuery,
    'change',
  );

  private readonly fullscreenApiChange$ = fromEvent(document.body, 'fullscreenchange');

  private readonly fullscreenApiError$ = fromEvent(document.body, 'fullscreenerror');

  public readonly fullscreenSource = toSignal(
    merge(
      this.fullscreenDisplayModeChange$,
      this.fullscreenApiChange$,
      this.fullscreenApiError$,
    ).pipe(
      startWith(undefined),
      map(() => this.getFullscreenSource()),
    ),
  );

  public readonly isFullscreenOpen = computed(() => this.fullscreenSource() != null);

  public readonly canFullscreenBeToggled = computed(
    () => this.fullscreenSource() !== 'browser' && document.fullscreenEnabled,
  );

  public toggleFullscreen() {
    if (!this.canFullscreenBeToggled()) {
      return;
    }

    if (this.isFullscreenOpen()) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  private getFullscreenSource(): FullscreenSource | undefined {
    if (document.fullscreenElement !== null) {
      return 'fullscreen-api';
    }

    if (this.browserFullscreenMediaQuery.matches) {
      return 'browser';
    }

    return undefined;
  }
}
