import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth/auth-service.service';
import { provideRouter, Router } from '@angular/router';
import { provideStore, Store } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { setTokenPresent } from '../state/auth.actions';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {RouterTestingHarness} from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let store: jasmine.SpyObj<Store>;
  let routerTestingHarness: RouterTestingHarness;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(), // Provides HttpClient
        provideHttpClientTesting(), // Provides HttpTestingController
        { provide: Store, useValue: storeSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    routerTestingHarness = TestBed.inject(RouterTestingHarness);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Reactive Form', () => {
    it('should initialize the form with required fields', () => {
      expect(component.loginForm).toBeTruthy();
      expect(component.loginForm.get('email')).toBeTruthy();
      expect(component.loginForm.get('password')).toBeTruthy();
    });
  
    it('should make the email field required', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.valid).toBeFalsy();
      expect(emailControl?.errors?.['required']).toBeTruthy();
    });
  
    it('should validate email format', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalsy();
      expect(emailControl?.errors?.['email']).toBeTruthy();
    });
  
    it('should make the password field required', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.valid).toBeFalsy();
      expect(passwordControl?.errors?.['required']).toBeTruthy();
    });
  });

  describe('login', () => {
    it('should handle successful login', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const response = { success: true, message: 'Login successful' };
  
      authService.login.and.returnValue(of(response));
  
      component.loginForm.setValue(loginData);
      await component.login();
  
      expect(store.dispatch).toHaveBeenCalledWith(setTokenPresent());
      expect(store.dispatch).toHaveBeenCalledTimes(1); // Ensure dispatch was called only once
    });
  
    it('should handle failed login and show error message', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const response = { success: false, message: 'Invalid email or password' };
  
      authService.login.and.returnValue(of(response));
  
      component.loginForm.setValue(loginData);
      component.login();
  
      expect(component.loginError).toEqual(response.message);
  
      // Simulate delay for error message clearing
      jasmine.clock().install();
      jasmine.clock().tick(1000);
      jasmine.clock().uninstall();
      expect(component.loginError).toBeNull();
    });
  
    it('should handle server error during login', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const errorMessage = 'Server error';
  
      authService.login.and.returnValue(throwError(() => new Error(errorMessage)));
  
      component.loginForm.setValue(loginData);
      component.login();
  
      expect(component.loginError).toEqual(errorMessage);
  
      // Simulate delay for error message clearing
      jasmine.clock().install();
      jasmine.clock().tick(1000);
      jasmine.clock().uninstall();
      expect(component.loginError).toBeNull();
    });

  });
})