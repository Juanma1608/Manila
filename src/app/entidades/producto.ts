
export class Producto {

  constructor(
    public id: string,
    public nombre: string,
    public imagen: string,
    public precio: number,
    public cantidad: number,
    public tipo: string
  ) { }

  calcularSubtotal(): number {
    return this.precio * this.cantidad;
  }

  aumentarCantidad(): void {
    this.cantidad++;
  }

  disminuirCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

}
