import { Component, inject } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';import { clearTokenPresent, setTokenPresent } from './state/auth.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectTokenPresent } from './state/auth.selectors';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { AuthService } from './services/auth/auth-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,RouterLinkActive,AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private tokenKey = 'authToken';
  private store = inject(Store)
  private router = inject(Router);
  private authService = inject(AuthService);

  tokenPresent$: Observable<boolean>

  constructor() {
    this.tokenPresent$ = this.store.select(selectTokenPresent);
  }

  ngOnInit() {
    // Check token presence on initialization
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.store.dispatch(setTokenPresent());
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next:(response)=>{
        if(response.success === true ){
          this.store.dispatch(clearTokenPresent());
          this.router.navigate(['/']);
        }
      },
      error:(err)=>{
        console.error(`Error logging out ${err}`)
      }
    })
  }
  
}
