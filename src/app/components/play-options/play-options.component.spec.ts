import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayOptionsComponent } from './play-options.component';

describe('PlayOptionsComponent', () => {
  let component: PlayOptionsComponent;
  let fixture: ComponentFixture<PlayOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
