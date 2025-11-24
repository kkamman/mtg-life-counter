import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerGrid } from './player-grid';

describe('PlayerGrid', () => {
  let component: PlayerGrid;
  let fixture: ComponentFixture<PlayerGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
