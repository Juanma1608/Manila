
export class Cliente {

  constructor(
    public nombre: string,
    public celular: string,
    public direccion: string,
    public observaciones: string = ''
  ) { }

  obtenerDatos(): string {
    return `Cliente: ${this.nombre}, Celular: ${this.celular}, Dirección: ${this.direccion}`;
  }

}
