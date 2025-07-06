import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { NavigationGuard } from './navigation.guard';

describe('navigationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => NavigationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
