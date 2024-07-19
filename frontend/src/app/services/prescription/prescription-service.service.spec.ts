import { TestBed } from '@angular/core/testing';

import { PrescriptionServiceService } from './prescription-service.service';

describe('PrescriptionServiceService', () => {
  let service: PrescriptionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrescriptionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
