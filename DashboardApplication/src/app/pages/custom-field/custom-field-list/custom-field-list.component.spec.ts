import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldListComponent } from './custom-field-list.component';

describe('CustomFieldListComponent', () => {
  let component: CustomFieldListComponent;
  let fixture: ComponentFixture<CustomFieldListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFieldListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomFieldListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
