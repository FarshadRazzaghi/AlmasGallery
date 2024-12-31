import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInventoryAdvancedComponent } from './product-inventory-advanced.component';

describe('ProductInventoryAdvancedComponent', () => {
  let component: ProductInventoryAdvancedComponent;
  let fixture: ComponentFixture<ProductInventoryAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInventoryAdvancedComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductInventoryAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
