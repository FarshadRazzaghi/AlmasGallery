import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInventoryRestockComponent } from './product-inventory-restock.component';

describe('ProductInventoryRestockComponent', () => {
  let component: ProductInventoryRestockComponent;
  let fixture: ComponentFixture<ProductInventoryRestockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInventoryRestockComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductInventoryRestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
