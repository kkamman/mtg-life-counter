import { TestBed } from '@angular/core/testing';

import { LayoutStore } from './layout-store';

describe('LayoutStore', () => {
  let service: LayoutStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
