import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LeccionService } from './services/leccion.service';
import { LeccionCompletaDTO } from './models/leccion.dto';
import { AuthService } from './core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  protected readonly title = signal('frontend-tesis');
  public authService = inject(AuthService);

  // 5. ESCUCHAR EL CLICK: Cuando el usuario toque un botón en el HTML...
}
