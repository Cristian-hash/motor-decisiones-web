import { TestBed } from '@angular/core/testing';

import { LeccionService } from './leccion.service';

describe('Leccion', () => {
  let service: LeccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
