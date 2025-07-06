import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldGroupComponent } from '../../custom-field-upsert/custom-field-group/custom-field-group.component';

describe('CustomFieldGroupComponent', () => {
  let component: CustomFieldGroupComponent;
  let fixture: ComponentFixture<CustomFieldGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFieldGroupComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomFieldGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
