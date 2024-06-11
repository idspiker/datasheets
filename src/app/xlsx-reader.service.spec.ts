import { TestBed } from '@angular/core/testing';

import { XlsxReaderService } from './xlsx-reader.service';

describe('XlsxReaderService', () => {
  let service: XlsxReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XlsxReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
