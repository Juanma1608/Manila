import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BebidasService } from '../servicios/bebidas.service';
import { ComidasService } from '../servicios/comidas.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  imagenComida: string = '';
  imagenBebida: string = '';

  constructor(
    private bebidasService: BebidasService,
    private comidasService: ComidasService
  ) {}

  ngOnInit(): void {

    // Obtener una comida aleatoria
    this.comidasService.obtenerAleatoria().subscribe({
      next: (respuesta) => {
        if (respuesta.meals && respuesta.meals.length > 0) {
          this.imagenComida = respuesta.meals[0].strMealThumb;
        }
      },
      error: (error) => {
        console.error('Error al cargar la comida:', error);
      }
    });

    // Obtener una bebida aleatoria
    this.bebidasService.obtenerAleatoria().subscribe({
      next: (respuesta) => {
        if (respuesta.drinks && respuesta.drinks.length > 0) {
          this.imagenBebida = respuesta.drinks[0].strDrinkThumb;
        }
      },
      error: (error) => {
        console.error('Error al cargar la bebida:', error);
      }
    });

  }
}