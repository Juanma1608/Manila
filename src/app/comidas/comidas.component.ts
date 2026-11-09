
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ComidasService } from '../servicios/comidas.service';
import { PedidosService } from '../servicios/pedidos.service';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comidas.component.html',
  styleUrl: './comidas.component.css'
})
export class ComidasComponent implements OnInit {

  comidas: any[] = [];
  categorias: any[] = [];

  nombre = '';
  ingrediente = '';
  categoria = 'Beef';

  cargando = false;
  mensajeError = '';

  constructor(
    private comidasService: ComidasService,
    private pedidosService: PedidosService
  ) { }

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias(): void {
    this.comidasService.obtenerCategorias().subscribe({
      next: (respuesta) => {
        this.categorias = respuesta.categories || [];
        this.cargarCategoria();
      },
      error: () => {
        this.mensajeError = 'No fue posible cargar las categorías.';
      }
    });
  }

  cargarCategoria(): void {
    this.nombre = '';
    this.ingrediente = '';
    this.mensajeError = '';
    this.cargando = true;

    this.comidasService.buscarPorCategoria(this.categoria).subscribe({
      next: (respuesta) => {
        this.obtenerDetalles(respuesta.meals || []);
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'Error al cargar los platos.';
      }
    });
  }

  buscarNombre(): void {
    if (!this.nombre.trim()) {
      this.cargarCategoria();
      return;
    }

    this.ingrediente = '';
    this.mensajeError = '';
    this.cargando = true;

    this.comidasService.buscarPorNombre(this.nombre).subscribe({
      next: (respuesta) => {
        this.comidas = (respuesta.meals || []).map((comida: any) => ({
          ...comida,
          precio: this.generarPrecio()
        }));

        this.cargando = false;

        if (this.comidas.length === 0) {
          this.mensajeError = 'No encontramos platos con ese nombre.';
        }
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'Error al buscar los platos.';
      }
    });
  }

  buscarIngrediente(): void {
    if (!this.ingrediente.trim()) {
      this.cargarCategoria();
      return;
    }

    this.nombre = '';
    this.mensajeError = '';
    this.cargando = true;

    this.comidasService.buscarPorIngrediente(this.ingrediente).subscribe({
      next: (respuesta) => {
        this.obtenerDetalles(respuesta.meals || []);
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'Error al buscar por ingrediente.';
      }
    });
  }

  obtenerDetalles(lista: any[]): void {
    if (lista.length === 0) {
      this.comidas = [];
      this.cargando = false;
      this.mensajeError = 'No encontramos platos disponibles.';
      return;
    }

    const solicitudes = lista.map((comida: any) =>
      this.comidasService.obtenerDetalle(comida.idMeal)
    );

    forkJoin(solicitudes).subscribe({
      next: (respuestas) => {
        this.comidas = respuestas
          .map((respuesta: any) => respuesta.meals?.[0])
          .filter((comida: any) => comida)
          .map((comida: any) => ({
            ...comida,
            precio: this.generarPrecio()
          }));

        this.cargando = false;

        if (this.comidas.length === 0) {
          this.mensajeError = 'No encontramos platos disponibles.';
        }
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'No fue posible cargar los detalles.';
      }
    });
  }

  generarPrecio(): number {
    return Math.floor(Math.random() * (45000 - 18000 + 1)) + 18000;
  }

  obtenerIngredientes(comida: any): string[] {
    const ingredientes: string[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingrediente = comida['strIngredient' + i];

      if (ingrediente && ingrediente.trim()) {
        ingredientes.push(ingrediente);
      }
    }

    return ingredientes;
  }

  formatoPrecio(precio: number): string {
    return precio.toLocaleString('es-CO');
  }

  agregarAlPedido(comida: any): void {
    this.pedidosService.agregarProducto(comida, 'comida');
    alert('¡Plato agregado al pedido!');
  }

}
