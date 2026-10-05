import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  standalone: true,
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent {
  private router = inject(Router);

  // MOCK DE ARQUITECTURA: Estos datos eventualmente llegarán de Spring Boot
  // basándose en tu tabla "progresos" y "patrones".
  niveles = [
    {
      id: 1,
      titulo: 'Patrones de Creación',
      leccionInicialId: 1, // La primera pregunta de este bloque
      estado: 'COMPLETADO',
      icono: '⭐',
    },
    {
      id: 2,
      titulo: 'Patrones Estructurales',
      leccionInicialId: 8, // Asumiendo que este bloque empieza en el ID 8
      estado: 'ACTIVO',
      icono: '🚀',
    },
    {
      id: 3,
      titulo: 'Patrones de Comportamiento',
      leccionInicialId: 15,
      estado: 'BLOQUEADO',
      icono: '🔒',
    },
  ];

  entrarAlNivel(nivel: any) {
    if (nivel.estado === 'BLOQUEADO') {
      console.log('Nivel bloqueado. ¡Paso a paso puedo con todo, pero aún no!');
      return;
    }

    // Limpiamos memorias residuales antes de entrar al campo de batalla
    localStorage.removeItem('faseRepeticion');
    localStorage.removeItem('colaFalladas');
    localStorage.removeItem('leccionActual');

    // ¡Viajamos a la lección inicial de este nivel!
    this.router.navigate(['/leccion', nivel.leccionInicialId]);
  }
}
