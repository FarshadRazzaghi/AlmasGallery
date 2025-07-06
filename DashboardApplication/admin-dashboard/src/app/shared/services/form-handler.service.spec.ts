import { TestBed } from '@angular/core/testing';

import { FormHandlerService } from './form-handler.service';
import { FormValidation } from '../models';

describe('FormHandlerService', () => {
  let service: FormHandlerService<FormValidation<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
