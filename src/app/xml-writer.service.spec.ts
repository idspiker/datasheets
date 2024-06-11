import { TestBed } from '@angular/core/testing';

import { XmlWriterService } from './xml-writer.service';

describe('XmlWriterService', () => {
  let service: XmlWriterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XmlWriterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
