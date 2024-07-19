// src/app/state/auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectAuthState = createFeatureSelector<boolean>('auth');

export const selectTokenPresent = createSelector(
  selectAuthState,
  (state: boolean) => state
);
