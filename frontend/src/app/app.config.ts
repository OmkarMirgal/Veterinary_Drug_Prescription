import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { authReducer } from './state/auth.reducer';


export const appConfig: ApplicationConfig = {
  // providers: [provideRouter(routes), provideHttpClient()],
  providers: [provideRouter(routes), provideHttpClient(),provideStore({
    auth: authReducer, // Register the auth feature
  })],
};
