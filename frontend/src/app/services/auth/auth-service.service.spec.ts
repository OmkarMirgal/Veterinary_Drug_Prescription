import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth-service.service';
import { ISignupData, ILoginData, ILoginResponse } from '../../model/auth';
import { HttpHeaders } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signup', () => {
    it('should send a POST request to signup endpoint', () => {
      const signupData: ISignupData = { name: 'testuser', email:'test@gmail.com', password: 'testpassword', password_confirmation:'testpassword', licence:'licence@abc' };
  
      service.signup(signupData).subscribe((result) => {
        expect(result).toBeTruthy();
      });
  
      const req = httpTestingController.expectOne('http://localhost:3000/api/signup');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ user: signupData });
      
      // Respond with a mock response
      req.flush({ success: true });
    });
  
    it('should return false on signup error', () => {
      const signupData: ISignupData = {
        name: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        password_confirmation: 'testpassword',
        licence: 'licence@abc'
      };
    
      service.signup(signupData).subscribe(result => {
        expect(result).toBeFalse();
      });
    
      const req = httpTestingController.expectOne('http://localhost:3000/api/signup');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ user: signupData });
    
      const signUpError = {
          "errors": [
              "Email has already been taken",
              "Licence has already been taken"
          ]
      }
      // Simulate a 422 Unprocessable Content 
      req.flush(
        { error: signUpError }, // Response body
        { status: 422, statusText: 'Unprocessable Content' } // Options including status and statusText
      );
    });
    
  });

  describe('login', () => {
    it('should send a POST request to login endpoint', () => {
      const loginData: ILoginData = { email: 'testuser@gmail.com', password: 'testpassword' };

      service.login(loginData).subscribe((result) => {
        expect(result.success).toBeTruthy();
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/login');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ user: loginData });

      // Respond with a mock response
      const mockResponse: ILoginResponse = { token: 'mockToken', message: 'Login successful' };
      req.flush(mockResponse);
    });

    it('should set token during login', () => {
      const loginData = { email: 'testuser', password: 'testpassword' };
      const mockResponse = { token: 'testToken', message: 'Login successful' };
    
      // Spy on the private setToken method
      spyOn<any>(service, 'setToken').and.callThrough();
    
      service.login(loginData).subscribe(response => {
        expect(response.success).toBeTrue();
        expect(response.message).toEqual('Login successful');
      });
    
      const req = httpTestingController.expectOne('http://localhost:3000/api/login');
      req.flush(mockResponse);
    
      // Ensure setToken was called with the correct token
      expect((service as any).setToken).toHaveBeenCalledWith(mockResponse.token);
    });

    it('should handle login errors appropriately', () => {
      const loginData: ILoginData = { email: 'testuser', password: 'aasc' };

      service.login(loginData).subscribe((result) => {
        expect(result.success).toBeFalsy();
        expect(result.message).toEqual('Invalid email or password');
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/login');

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ user: loginData });

      // Simulate a 401 Unauthorized error with a custom error message
       req.flush(
        { error: 'Invalid email or password' }, // Response body
        { status: 401, statusText: 'Unauthorized' } // Options including status and statusText
      );

    });
  });

});
