
import { Producto } from './producto';

export class Comida extends Producto {

  constructor(
    id: string,
    nombre: string,
    imagen: string,
    precio: number,
    cantidad: number = 1,
    public ingredientes: string[] = [],
    public categoria: string = ''
  ) {
    super(id, nombre, imagen, precio, cantidad, 'comida');
  }

}
