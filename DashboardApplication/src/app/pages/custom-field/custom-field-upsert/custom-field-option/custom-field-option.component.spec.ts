import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldOptionComponent } from './custom-field-option.component';

describe('CustomFieldOptionComponent', () => {
  let component: CustomFieldOptionComponent;
  let fixture: ComponentFixture<CustomFieldOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFieldOptionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomFieldOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
