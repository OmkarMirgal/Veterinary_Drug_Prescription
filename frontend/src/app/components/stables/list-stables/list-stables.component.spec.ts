import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStablesComponent } from './list-stables.component';

describe('ListStablesComponent', () => {
  let component: ListStablesComponent;
  let fixture: ComponentFixture<ListStablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListStablesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListStablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
