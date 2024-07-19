import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StableFormComponent } from './stable-form.component';

describe('StableFormComponent', () => {
  let component: StableFormComponent;
  let fixture: ComponentFixture<StableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StableFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
