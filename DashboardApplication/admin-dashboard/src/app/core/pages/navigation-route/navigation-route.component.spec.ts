import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationRouteComponent } from './navigation-route.component';

describe('NavigationRouteComponent', () => {
  let component: NavigationRouteComponent;
  let fixture: ComponentFixture<NavigationRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationRouteComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NavigationRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
