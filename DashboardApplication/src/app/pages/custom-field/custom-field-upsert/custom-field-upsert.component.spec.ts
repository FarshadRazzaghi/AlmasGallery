import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldUpsertComponent } from './custom-field-upsert.component';

describe('CustomFieldUpsertComponent', () => {
  let component: CustomFieldUpsertComponent;
  let fixture: ComponentFixture<CustomFieldUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFieldUpsertComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomFieldUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
