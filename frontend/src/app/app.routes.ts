import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './auth.guard';
import { ListStablesComponent } from './components/stables/list-stables/list-stables.component';
import { StableFormComponent } from './components/stables/stable-form/stable-form.component';
import { ListPrescriptionsComponent } from './components/prescriptions/list-prescriptions/list-prescriptions.component';
import { PrescriptionFormComponent } from './components/prescriptions/prescription-form/prescription-form.component';
import { addEditGuard } from './add-edit.guard';
import { loginSignupGuard } from './login-signup.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginSignupGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [loginSignupGuard] },
  
  // Stables routes
  { path: 'stables', component: ListStablesComponent ,canActivate: [authGuard] },
  { path: 'stables/add', component: StableFormComponent ,canActivate: [authGuard] },
  { path: 'stables/edit/:stableId', component: StableFormComponent ,canActivate: [authGuard] },
  
  // Prescriptions routes 
  { path: 'prescriptions', component: ListPrescriptionsComponent ,canActivate: [authGuard] },
  { path: 'prescriptions/add', component: PrescriptionFormComponent ,canActivate: [authGuard,addEditGuard] },
  { path: 'prescriptions/edit', component: PrescriptionFormComponent ,canActivate: [authGuard,addEditGuard] },
  
  { path: '**', redirectTo: '/login', pathMatch: 'full'},
];
