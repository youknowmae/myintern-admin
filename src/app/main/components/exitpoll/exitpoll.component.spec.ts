import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitpollComponent } from './exitpoll.component';

describe('ExitpollComponent', () => {
  let component: ExitpollComponent;
  let fixture: ComponentFixture<ExitpollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExitpollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExitpollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
