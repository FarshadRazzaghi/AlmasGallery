import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInventoryShippingComponent } from './product-inventory-shipping.component';

describe('ProductInventoryShippingComponent', () => {
  let component: ProductInventoryShippingComponent;
  let fixture: ComponentFixture<ProductInventoryShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInventoryShippingComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductInventoryShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
