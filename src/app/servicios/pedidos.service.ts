
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Producto } from '../entidades/producto';
import { DetallePedido } from '../entidades/detalle-pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private carrito = new BehaviorSubject<DetallePedido[]>([]);

  carrito$ = this.carrito.asObservable();

  agregarProducto(producto: Producto): void {

    const lista = [...this.carrito.value];

    const existente = lista.find(detalle =>
      detalle.producto.id === producto.id &&
      detalle.producto.tipo === producto.tipo
    );

    if (existente) {

      existente.cantidad++;

    } else {

      lista.push(new DetallePedido(producto, 1));

    }

    this.carrito.next(lista);
  }

  cambiarCantidad(id: string, tipo: string, cambio: number): void {

    const lista = this.carrito.value.map(detalle => {

      if (
        detalle.producto.id === id &&
        detalle.producto.tipo === tipo
      ) {
        detalle.cantidad += cambio;
      }

      return detalle;

    }).filter(detalle => detalle.cantidad > 0);

    this.carrito.next(lista);
  }

  eliminarProducto(id: string, tipo: string): void {

    const lista = this.carrito.value.filter(detalle =>
      !(detalle.producto.id === id &&
        detalle.producto.tipo === tipo)
    );

    this.carrito.next(lista);
  }

  obtenerTotal(): number {

    return this.carrito.value.reduce(
      (total, detalle) => total + detalle.calcularSubtotal(),
      0
    );

  }

  vaciarCarrito(): void {
    this.carrito.next([]);
  }

}
