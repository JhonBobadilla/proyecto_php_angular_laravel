import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // 👈 Importar CommonModule para *ngIf

@Component({
  selector: 'app-results',
  standalone: true, // 👈 Importante en Angular 16+
  imports: [CommonModule], // 👈 Habilitar *ngIf y otras directivas
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  city: string = '';
  budget: number = 0;
  weather: any = {}; // Evita errores de `null`
  currencyName: string = '';
  currencySymbol: string = '';
  convertedBudget: number = 0;
  exchangeRate: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      console.log("Parámetros recibidos en Results:", params);

      this.city = params['city'];
      this.budget = Number(params['budget']);

      if (this.city && this.budget > 0) {
        this.fetchWeather();
        this.fetchCurrency();
      } else {
        alert("Datos inválidos. Regresando a inicio.");
        this.router.navigate(['/']);
      }
    });
  }

  fetchWeather() {
    console.log("Obteniendo clima para:", this.city);
    this.weather = {
      temperature: 25 // Valor de prueba
    };
  }

  fetchCurrency() {
    console.log("Obteniendo tasa de cambio...");
    this.currencyName = 'Euro'; 
    this.currencySymbol = '€';
    this.exchangeRate = 0.00022;
    this.convertedBudget = this.budget * this.exchangeRate;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}


