import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldDeleteModalComponent } from './custom-field-delete.modal.component';

describe('CustomFieldDeleteModalComponent', () => {
  let component: CustomFieldDeleteModalComponent;
  let fixture: ComponentFixture<CustomFieldDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFieldDeleteModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomFieldDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
