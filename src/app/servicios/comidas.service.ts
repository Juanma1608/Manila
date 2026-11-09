
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComidasService {

  private api = 'https://www.themealdb.com/api/json/v1/1/';

  constructor(private http: HttpClient) { }

  // Buscar comidas por nombre
  buscarPorNombre(nombre: string): Observable<any> {
    return this.http.get<any>(
      this.api + 'search.php?s=' + encodeURIComponent(nombre)
    );
  }

  // Buscar comidas por ingrediente
  buscarPorIngrediente(ingrediente: string): Observable<any> {
    return this.http.get<any>(
      this.api + 'filter.php?i=' + encodeURIComponent(ingrediente)
    );
  }

  // Obtener todas las categorías
  obtenerCategorias(): Observable<any> {
    return this.http.get<any>(this.api + 'categories.php');
  }

  // Buscar comidas por categoría
  buscarPorCategoria(categoria: string): Observable<any> {
    return this.http.get<any>(
      this.api + 'filter.php?c=' + encodeURIComponent(categoria)
    );
  }

  // Obtener información completa de una comida
  obtenerDetalle(id: string): Observable<any> {
    return this.http.get<any>(
      this.api + 'lookup.php?i=' + id
    );
  }
  obtenerAleatoria(): Observable<any> {
  return this.http.get<any>(this.api + 'random.php');
}

}
