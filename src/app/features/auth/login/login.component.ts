import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; //<-- Herrameinta que lee las cajas de texto
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthRequestDTO } from '../../../models/auth.dto';
import { environment } from '../../../../environments/environments';

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
  private http = inject(HttpClient);
  //2. El pergamino en blanco con la forma exacta del DTO
  credenciales: AuthRequestDTO = {
    email: '',
    password: '',
  };
  //3. El cartel de error (inicia limpio)
  mensajeError: string = '';

  ingresar() {
    this.mensajeError = '';
    console.log('✅ Tocando la puerta del servidor...');

    this.authService.iniciarSesion(this.credenciales).subscribe({
      next: () => {
        console.log('✅Acceso concedido. Consultando el mapa de progreso...');

        const usuarioId = this.authService.obtenerIdUsuarioActual();

        this.http
          .get<number>(`${environment.apiUrl}/usuarios/${usuarioId}/siguiente-leccion`)
          .subscribe({
            next: (siguienteId) => {
              console.log(`🗺️ El backend indica la ruta: Lección ${siguienteId}`);
              // Navegación dinámica dictada por la base de datos
              this.router.navigate([`/leccion/${siguienteId}`]);
            },
            error: (err) => {
              console.warn(
                '⚠️ No se pudo obtener el progreso, enviando a la Lección 1 por seguridad.',
              );
              // Plan de contingencia si el servidor de progreso falla
              this.router.navigate(['/leccion/1']);
            },
          });
      },
      error: (errorRespuesta) => {
        console.error('❌ Error en la puerta:', errorRespuesta);
        this.mensajeError = 'Credenciales incorrectas. Intenta de nuevo.';
      },
    });
  }
}
