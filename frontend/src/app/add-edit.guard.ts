import { inject } from '@angular/core';
import {  CanActivateFn, Router } from '@angular/router';
import { IPrescriptionData } from './model/prescription';

export const addEditGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  
  // Attempt to access navigation extras state from the previous route
  const navigation = router.getCurrentNavigation();
  const routeTo = navigation?.finalUrl?.root?.children?.['primary']?.segments[0]?.path;
  if (navigation?.extras?.state?.['stableId'] || navigation?.extras?.state?.['prescription'] as IPrescriptionData ) {
    return true;
  } else {
    router.navigateByUrl(`/${routeTo}`);
    return false;
  }
};
