
import { Cliente } from './cliente';
import { DetallePedido } from './detalle-pedido';

export class Pedido {

  constructor(
    public cliente: Cliente,
    public productos: DetallePedido[],
    public fecha: Date = new Date()
  ) { }

  calcularTotal(): number {
    return this.productos.reduce(
      (total, detalle) => total + detalle.calcularSubtotal(),
      0
    );
  }

  agregarProducto(detalle: DetallePedido): void {
    this.productos.push(detalle);
  }

  eliminarProducto(indice: number): void {
    this.productos.splice(indice, 1);
  }

}
