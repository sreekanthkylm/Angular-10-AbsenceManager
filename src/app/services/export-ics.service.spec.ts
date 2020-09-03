import { TestBed } from '@angular/core/testing';

import { ExportIcsService } from './export-ics.service';

describe('ExportIcsService', () => {
  let service: ExportIcsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportIcsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
