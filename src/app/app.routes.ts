import { Routes } from '@angular/router';
import { LeccionComponent } from './features/leccion/leccion.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth-guard';
import { leccionGuard } from './core/guards/leccion-guard';
import { LobbyComponent } from './lobby/lobby.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'leccion/:id',
    component: LeccionComponent,
    canActivate: [authGuard, leccionGuard],
  },
  { path: 'lobby', component: LobbyComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
