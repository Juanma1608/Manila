
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { from, of } from 'rxjs';
import { mergeMap, map, toArray, catchError } from 'rxjs/operators';

import { BebidasService } from '../servicios/bebidas.service';
import { PedidosService } from '../servicios/pedidos.service';
import { Bebida } from '../entidades/bebida';

@Component({
  selector: 'app-bebidas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './bebidas.component.html',
  styleUrl: './bebidas.component.css'
})
export class BebidasComponent implements OnInit {

  bebidas: Bebida[] = [];

  nombre = '';
  ingrediente = '';
  tipoAlcohol = '';
  categoria = '';

  cargando = false;
  mensajeError = '';

  constructor(
    private bebidasService: BebidasService,
    private pedidosService: PedidosService
  ) { }

  ngOnInit(): void {
    this.cargarBebidas();
  }

  cargarBebidas(): void {

    this.bebidas = [];
    this.cargando = true;
    this.mensajeError = '';

    if (this.categoria) {

      this.bebidasService.buscarPorCategoria(this.categoria).subscribe({
        next: (respuesta) => {
          this.obtenerDetalles(respuesta.drinks || []);
        },
        error: () => this.errorCarga()
      });

    } else if (this.tipoAlcohol) {

      this.bebidasService.buscarPorAlcohol(this.tipoAlcohol).subscribe({
        next: (respuesta) => {
          this.obtenerDetalles(respuesta.drinks || []);
        },
        error: () => this.errorCarga()
      });

    } else {

      this.bebidasService.buscarPorCategoria('Cocktail').subscribe({
        next: (respuesta) => {
          this.obtenerDetalles(respuesta.drinks || []);
        },
        error: () => this.errorCarga()
      });

    }
  }

  buscarNombre(): void {

    if (!this.nombre.trim()) {
      this.cargarBebidas();
      return;
    }

    this.bebidas = [];
    this.ingrediente = '';
    this.cargando = true;
    this.mensajeError = '';

    this.bebidasService.buscarPorNombre(this.nombre).subscribe({

      next: (respuesta) => {

        this.bebidas = (respuesta.drinks || []).map((bebida: any) =>
          this.convertirBebida(bebida)
        );

        this.aplicarFiltros();
        this.finalizarBusqueda();

      },

      error: () => this.errorCarga()

    });
  }

  buscarIngrediente(): void {

    if (!this.ingrediente.trim()) {
      this.cargarBebidas();
      return;
    }

    this.bebidas = [];
    this.nombre = '';
    this.cargando = true;
    this.mensajeError = '';

    this.bebidasService.buscarPorIngrediente(this.ingrediente).subscribe({

      next: (respuesta) => {
        this.obtenerDetalles(respuesta.drinks || []);
      },

      error: () => this.errorCarga()

    });
  }

  obtenerDetalles(lista: any[]): void {

    if (lista.length === 0) {
      this.bebidas = [];
      this.cargando = false;
      this.mensajeError = 'No encontramos bebidas disponibles.';
      return;
    }

    from(lista).pipe(

      mergeMap(
        (bebida: any) =>
          this.bebidasService.obtenerDetalle(bebida.idDrink).pipe(

            map((respuesta: any) => respuesta.drinks?.[0] || null),

            catchError(() => of(null))

          ),
        5
      ),

      toArray()

    ).subscribe({

      next: (respuestas) => {

        this.bebidas = respuestas
          .filter((bebida: any) => bebida !== null)
          .map((bebida: any) => this.convertirBebida(bebida));

        this.aplicarFiltros();
        this.finalizarBusqueda();

      },

      error: () => this.errorCarga()

    });
  }

  convertirBebida(bebida: any): Bebida {

    return new Bebida(
      bebida.idDrink,
      bebida.strDrink,
      bebida.strDrinkThumb,
      this.generarPrecio(),
      1,
      this.obtenerIngredientes(bebida),
      bebida.strAlcoholic || '',
      bebida.strCategory || ''
    );

  }

  aplicarFiltros(): void {

    if (this.tipoAlcohol) {
      this.bebidas = this.bebidas.filter((bebida: Bebida) =>
        bebida.tipoAlcohol === this.tipoAlcohol
      );
    }

    if (this.categoria) {
      this.bebidas = this.bebidas.filter((bebida: Bebida) =>
        bebida.categoria === this.categoria
      );
    }

  }

  cambiarFiltros(): void {
    this.nombre = '';
    this.ingrediente = '';
    this.cargarBebidas();
  }

  generarPrecio(): number {
    return Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000;
  }

  obtenerIngredientes(bebida: any): string[] {

    const ingredientes: string[] = [];

    for (let i = 1; i <= 15; i++) {

      const ingrediente = bebida['strIngredient' + i];

      if (ingrediente && ingrediente.trim()) {
        ingredientes.push(ingrediente);
      }

    }

    return ingredientes;
  }

  formatoPrecio(precio: number): string {
    return precio.toLocaleString('es-CO');
  }

  finalizarBusqueda(): void {

    this.cargando = false;

    if (this.bebidas.length === 0) {
      this.mensajeError = 'No encontramos bebidas con esos filtros.';
    } else {
      this.mensajeError = '';
    }

  }

  errorCarga(): void {
    this.cargando = false;
    this.mensajeError = 'No fue posible cargar las bebidas. Intenta nuevamente.';
  }

  agregarAlPedido(bebida: Bebida): void {
    this.pedidosService.agregarProducto(bebida);
    alert('¡Bebida agregada al pedido!');
  }

}
