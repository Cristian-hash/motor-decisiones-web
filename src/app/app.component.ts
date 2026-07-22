import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeccionService } from './services/leccion.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  protected readonly title = signal('frontend-tesis');

  constructor(private leccionService: LeccionService) {
    this.leccionService.obtenerLeccion(1).subscribe();
  }
}
