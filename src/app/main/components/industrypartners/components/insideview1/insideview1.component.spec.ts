import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Insideview1Component } from './insideview1.component';

describe('Insideview1Component', () => {
  let component: Insideview1Component;
  let fixture: ComponentFixture<Insideview1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Insideview1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Insideview1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
