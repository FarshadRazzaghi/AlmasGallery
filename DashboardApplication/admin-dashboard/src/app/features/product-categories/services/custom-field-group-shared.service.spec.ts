import { TestBed } from '@angular/core/testing';

import { CustomFieldGroupSharedService } from './custom-field-group-shared.service';

describe('CustomFieldGroupSharedService', () => {
  let service: CustomFieldGroupSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomFieldGroupSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
