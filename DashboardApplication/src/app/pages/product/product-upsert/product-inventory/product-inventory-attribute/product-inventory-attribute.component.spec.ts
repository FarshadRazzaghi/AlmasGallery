import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInventoryAttributeComponent } from './product-inventory-attribute.component';

describe('ProductInventoryAttributeComponent', () => {
  let component: ProductInventoryAttributeComponent;
  let fixture: ComponentFixture<ProductInventoryAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInventoryAttributeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductInventoryAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
