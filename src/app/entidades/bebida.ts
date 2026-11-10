
import { Producto } from './producto';

export class Bebida extends Producto {

  constructor(
    id: string,
    nombre: string,
    imagen: string,
    precio: number,
    cantidad: number = 1,
    public ingredientes: string[] = [],
    public tipoAlcohol: string = '',
    public categoria: string = ''
  ) {
    super(id, nombre, imagen, precio, cantidad, 'bebida');
  }

}
