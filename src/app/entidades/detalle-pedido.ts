
import { Producto } from './producto';

export class DetallePedido {

  constructor(
    public producto: Producto,
    public cantidad: number
  ) { }

  calcularSubtotal(): number {
    return this.producto.precio * this.cantidad;
  }

}
