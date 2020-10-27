import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayAIComponent } from './play-ai.component';

describe('PlayMenuComponent', () => {
  let component: PlayAIComponent;
  let fixture: ComponentFixture<PlayAIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayAIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
