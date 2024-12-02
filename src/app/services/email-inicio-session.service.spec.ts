import { TestBed } from '@angular/core/testing';

import { EmailInicioSessionService } from './email-inicio-session.service';

describe('EmailInicioSessionService', () => {
  let service: EmailInicioSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailInicioSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
