import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; //<-- Herrameinta que lee las cajas de texto
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { AuthRequestDTO } from '../../../models/auth.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // 1. Mis expertos contratados
  private authService = inject(AuthService);
  private router = inject(Router);
  //2. El pergamino en blanco con la forma exacta del DTO
  credenciales: AuthRequestDTO = {
    email: '',
    password: '',
  };
  //3. El cartel de error (inicia limpio)
  mensajeError: string = '';
}
