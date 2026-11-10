
import { Component, OnInit } from '@angular/core';
import { BebidasService } from '../servicios/bebidas.service';
import { ComidasService } from '../servicios/comidas.service';
import { forkJoin } from 'rxjs';

interface Carta {
  id: number;
  nombre: string;
  imagen: string;
  mostrar: boolean;
  encontrada: boolean;
}

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent implements OnInit {

  cartas: Carta[] = [];
  intentos = 0;
  parejasEncontradas = 0;
  bloqueado = false;
  juegoTerminado = false;
  cargando = false;
  errorCarga = '';

  constructor(
    private comidasService: ComidasService,
    private bebidasService: BebidasService
  ) {}

  ngOnInit() {
    this.reiniciarJuego();
  }

  reiniciarJuego() {

    if (this.cargando) return;

    this.cargando = true;
    this.errorCarga = '';
    this.cartas = [];

    this.intentos = 0;
    this.parejasEncontradas = 0;
    this.bloqueado = false;
    this.juegoTerminado = false;

    forkJoin({
      comida: this.comidasService.obtenerAleatoria(),
      bebida: this.bebidasService.obtenerAleatoria()
    }).subscribe({

      next: (respuesta) => {

        const comida = respuesta.comida.meals?.[0];
        const bebida = respuesta.bebida.drinks?.[0];

        if (!comida || !bebida) {
          this.errorCarga = 'No se pudieron cargar las imágenes.';
          this.cargando = false;
          return;
        }

        const imagenes = [
          {
            nombre: 'Comida',
            imagen: comida.strMealThumb
          },
          {
            nombre: 'Bebida',
            imagen: bebida.strDrinkThumb
          }
        ];

        imagenes.forEach((item, indice) => {
          this.cartas.push({
            id: indice,
            nombre: item.nombre,
            imagen: item.imagen,
            mostrar: false,
            encontrada: false
          });
        });

        for (let i = 2; i < 16; i++) {
          this.cartas.push({
            id: i,
            nombre: 'Vacío',
            imagen: '',
            mostrar: false,
            encontrada: false
          });
        }

        // Mezclar posiciones aleatoriamente
        for (let i = this.cartas.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));

          [this.cartas[i], this.cartas[j]] =
          [this.cartas[j], this.cartas[i]];
        }

        this.cargando = false;
      },

      error: () => {
        this.errorCarga = 'Error al cargar las imágenes. Intenta nuevamente.';
        this.cargando = false;
      }

    });
  }

  voltearCarta(carta: Carta) {

    if (
      this.cargando ||
      this.errorCarga ||
      this.bloqueado ||
      carta.mostrar ||
      carta.encontrada ||
      this.juegoTerminado
    ) {
      return;
    }

    carta.mostrar = true;
    this.intentos++;

    if (carta.nombre === 'Vacío') {

      this.bloqueado = true;

      setTimeout(() => {
        carta.mostrar = false;
        this.bloqueado = false;
      }, 700);

      return;
    }

    carta.encontrada = true;
    this.parejasEncontradas++;

    if (this.parejasEncontradas === 2) {
      this.juegoTerminado = true;
    }
  }
}
