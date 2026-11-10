import { Routes } from '@angular/router';

import { InicioComponent } from './inicio/inicio.component';
import { ComidasComponent } from './comidas/comidas.component';
import { BebidasComponent } from './bebidas/bebidas.component';
import { JuegoComponent } from './juego/juego.component';
import { PedidosComponent } from './pedidos/pedidos.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'comidas', component: ComidasComponent },
  { path: 'bebidas', component: BebidasComponent },
  { path: 'juego', component: JuegoComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: '**', redirectTo: '' }
];