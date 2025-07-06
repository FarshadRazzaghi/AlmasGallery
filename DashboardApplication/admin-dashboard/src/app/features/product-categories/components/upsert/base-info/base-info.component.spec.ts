import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseInfoComponent } from './base-info.component';

describe('BaseInfoComponent', () => {
  let component: BaseInfoComponent;
  let fixture: ComponentFixture<BaseInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseInfoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BaseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
