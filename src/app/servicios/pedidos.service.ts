
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProductoPedido {
  id: string;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
  tipo: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private carrito = new BehaviorSubject<ProductoPedido[]>([]);

  carrito$ = this.carrito.asObservable();

  agregarProducto(producto: any, tipo: string): void {

    const lista = [...this.carrito.value];

    const id = tipo === 'comida'
      ? producto.idMeal
      : producto.idDrink;

    const nombre = tipo === 'comida'
      ? producto.strMeal
      : producto.strDrink;

    const imagen = tipo === 'comida'
      ? producto.strMealThumb
      : producto.strDrinkThumb;

    const existente = lista.find(p =>
      p.id === id && p.tipo === tipo
    );

    if (existente) {
      existente.cantidad++;
    } else {
      lista.push({
        id,
        nombre,
        imagen,
        precio: producto.precio,
        cantidad: 1,
        tipo
      });
    }

    this.carrito.next(lista);
  }

  cambiarCantidad(id: string, tipo: string, cambio: number): void {

    const lista = this.carrito.value.map(producto => {

      if (producto.id === id && producto.tipo === tipo) {
        return {
          ...producto,
          cantidad: producto.cantidad + cambio
        };
      }

      return producto;
    }).filter(producto => producto.cantidad > 0);

    this.carrito.next(lista);
  }

  eliminarProducto(id: string, tipo: string): void {

    const lista = this.carrito.value.filter(producto =>
      !(producto.id === id && producto.tipo === tipo)
    );

    this.carrito.next(lista);
  }

  obtenerTotal(): number {
    return this.carrito.value.reduce(
      (total, producto) =>
        total + producto.precio * producto.cantidad,
      0
    );
  }

  vaciarCarrito(): void {
    this.carrito.next([]);
  }

}
