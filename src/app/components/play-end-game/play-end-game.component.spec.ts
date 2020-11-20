import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayEndGameComponent } from './play-end-game.component';

describe('PlayEndGameComponent', () => {
  let component: PlayEndGameComponent;
  let fixture: ComponentFixture<PlayEndGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayEndGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayEndGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
