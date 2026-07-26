import { Routes } from '@angular/router';
import { LeccionComponent } from './features/leccion/leccion.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'leccion/:id',
    component: LeccionComponent,
    canActivate: [authGuard],
  },
];
