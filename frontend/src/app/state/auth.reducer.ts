// src/app/state/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { setTokenPresent, clearTokenPresent } from './auth.actions';

export const initialState = false;

const _authReducer = createReducer(
  initialState,
  on(setTokenPresent, (state) => true),
  on(clearTokenPresent, (state) => false)
);

export function authReducer(state: any, action: any) {
  return _authReducer(state, action);
}
