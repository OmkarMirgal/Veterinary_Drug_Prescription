// src/app/state/auth.actions.ts
import { createAction } from '@ngrx/store';

export const setTokenPresent = createAction('[Auth] Set Token Present');
export const clearTokenPresent = createAction('[Auth] Clear Token Present');
