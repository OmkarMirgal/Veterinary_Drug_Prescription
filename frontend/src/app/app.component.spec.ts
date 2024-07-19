import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth-service.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { clearTokenPresent, setTokenPresent } from './state/auth.actions';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let store: jasmine.SpyObj<Store>;
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    console.log(app)
    expect(app).toBeTruthy();
  });

  it('should dispatch setTokenPresent on init if token exists', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    spyOn(localStorage, 'getItem').and.returnValue('token');
    
    app.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(setTokenPresent());
  });

  it('should not dispatch setTokenPresent on init if token does not exist', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    app.ngOnInit();

    expect(store.dispatch).not.toHaveBeenCalledWith(setTokenPresent());
  });

  it('should dispatch clearTokenPresent and navigate on successful logout', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const response = { success: true, message:"Logged out successfully!" };

    authService.logout.and.returnValue(of(response));

    app.logout();
    tick();

    expect(store.dispatch).toHaveBeenCalledWith(clearTokenPresent());
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

});
