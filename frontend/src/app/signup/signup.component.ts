import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth/auth-service.service';
import { ISignupData } from '../model/auth';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {

  signupForm: FormGroup;
  authService = inject(AuthService);
  
  constructor(private formBuilder: FormBuilder,private router: Router ) {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      licence: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.signupForm.valueChanges.subscribe(() => {
      // Trigger validation and update error state
      if (this.signupForm.errors?.['passwordsDoNotMatch']) {
        this.signupForm.controls['password_confirmation'].setErrors({ passwordsDoNotMatch: true });
      } else {
        this.signupForm.controls['password_confirmation'].setErrors(null);
      }
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('password_confirmation')?.value;

    if (password !== confirmPassword) {
      return { passwordsDoNotMatch: true };
    }
    return null;
  }

  signup() {
    if (this.signupForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const signupData: ISignupData = this.signupForm.value;
    console.log(signupData);
    this.authService.signup(signupData).subscribe(success => {
      if (success) {
        this.router.navigate(['/login']);
      } else {
        alert('Signup failed');
      }
    });
  }

  private markAllAsTouched() {
    Object.keys(this.signupForm.controls).forEach((field) => {
      const control = this.signupForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

}
