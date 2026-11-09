import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BebidasService {

  private api = 'https://www.thecocktaildb.com/api/json/v1/1/';

  constructor(private http: HttpClient) { }

  buscarPorNombre(nombre: string): Observable<any> {
    return this.http.get<any>(
      this.api + 'search.php?s=' + encodeURIComponent(nombre)
    );
  }

  buscarPorIngrediente(ingrediente: string): Observable<any> {
    return this.http.get<any>(
      this.api + 'filter.php?i=' + encodeURIComponent(ingrediente)
    );
  }

  buscarPorAlcohol(tipo: string): Observable<any> {

    const valor = tipo === 'Non alcoholic'
      ? 'Non_Alcoholic'
      : tipo;

    return this.http.get<any>(
      this.api + 'filter.php?a=' + encodeURIComponent(valor)
    );
  }

  buscarPorCategoria(categoria: string): Observable<any> {

    const valor = categoria.replace(/ /g, '_');

    return this.http.get<any>(
      this.api + 'filter.php?c=' + encodeURIComponent(valor)
    );
  }

  obtenerDetalle(id: string): Observable<any> {
    return this.http.get<any>(
      this.api + 'lookup.php?i=' + id
    );
  }
  obtenerAleatoria(): Observable<any> {
  return this.http.get<any>(this.api + 'random.php');
}
}