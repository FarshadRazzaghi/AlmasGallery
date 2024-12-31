import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInventoryGlobalDeliveryComponent } from './product-inventory-global-delivery.component';

describe('ProductInventoryGlobalDeliveryComponent', () => {
  let component: ProductInventoryGlobalDeliveryComponent;
  let fixture: ComponentFixture<ProductInventoryGlobalDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInventoryGlobalDeliveryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductInventoryGlobalDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
