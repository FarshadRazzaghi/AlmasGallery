import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOrganizeComponent } from './product-organize.component';

describe('ProductOrganizeComponent', () => {
  let component: ProductOrganizeComponent;
  let fixture: ComponentFixture<ProductOrganizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductOrganizeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductOrganizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
