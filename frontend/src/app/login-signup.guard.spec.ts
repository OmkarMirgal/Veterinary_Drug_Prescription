import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginSignupGuard } from './login-signup.guard';

describe('loginSignupGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginSignupGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
