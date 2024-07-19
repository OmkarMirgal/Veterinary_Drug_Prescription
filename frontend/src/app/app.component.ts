import { Component, inject } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';import { clearTokenPresent, setTokenPresent } from './state/auth.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectTokenPresent } from './state/auth.selectors';
import { AsyncPipe, JsonPipe } from '@angular/common';

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
    // Your logout logic here
    localStorage.removeItem(this.tokenKey);
    this.store.dispatch(clearTokenPresent());
    this.router.navigate(['/']);
  }


}
