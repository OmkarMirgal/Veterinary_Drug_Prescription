import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth-service.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ILoginData } from '../model/auth';
import { Store } from '@ngrx/store';
import { setTokenPresent } from '../state/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);
  
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const loginData: ILoginData = this.loginForm.value;
    this.authService.login(loginData).subscribe(response => {
      if (response.success) {
        this.store.dispatch(setTokenPresent());
        this.router.navigate(['/stables']);
      } else {
        this.loginError= response.message
        this.clearLoginErrorAfterDelay();
      }
    });
  }

  private clearLoginErrorAfterDelay() {
    setTimeout(() => {
      this.loginError = null;
    }, 2000);
  }

  private markAllAsTouched() {
    Object.keys(this.loginForm.controls).forEach((field) => {
      const control = this.loginForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
