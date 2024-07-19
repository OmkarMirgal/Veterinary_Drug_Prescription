import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginSignupGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const token = localStorage.getItem('authToken');
  
  if (token !== null) {
    router.navigateByUrl('/stables');
  } 
    return true

};
