import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ResultsComponent } from './pages/results/results.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Ruta para la pantalla de inicio
  { path: 'results', component: ResultsComponent } // Ruta para la pantalla de resultados
];


