import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayBoardComponent } from './play-board.component';

describe('PlayBoardComponent', () => {
  let component: PlayBoardComponent;
  let fixture: ComponentFixture<PlayBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
