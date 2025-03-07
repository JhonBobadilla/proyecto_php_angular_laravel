import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { TravelService } from '../../services/travel.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  city: string = '';
  budget: number = 0;
  weather: any = null;
  currencyName: string = '';
  currencySymbol: string = '';
  convertedBudget: number = 0;
  exchangeRate: number = 0;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private travelService: TravelService
  ) {
    this.route.queryParams.subscribe(params => {
      console.log("🟢 Parámetros recibidos en Results:", params);

      this.city = this.formatCity(params['city']);
      this.budget = Number(params['budget']);

      if (!this.validarEntrada()) {
        alert("❌ Datos inválidos. Regresando a inicio.");
        this.router.navigate(['/']);
        return;
      }

      this.asignarMonedaPorDefecto();
      this.fetchWeather();
      this.fetchCurrency();
    });
  }

  private validarEntrada(): boolean {
    return this.city.trim() !== '' && this.budget > 0 && !isNaN(this.budget);
  }

  private formatCity(city: string): string {
    const cityMap: { [key: string]: string } = {
      'new-york': 'New York',
      'london': 'London',
      'paris': 'Paris',
      'tokyo': 'Tokyo',
      'madrid': 'Madrid'
    };
    return cityMap[city.toLowerCase()] || city;
  }

  private asignarMonedaPorDefecto(): void {
    const currencyMap: { [key: string]: { name: string, symbol: string } } = {
      'London': { name: 'Libra Esterlina', symbol: '£' },
      'New York': { name: 'Dólar Americano', symbol: '$' },
      'Paris': { name: 'Euro', symbol: '€' },
      'Madrid': { name: 'Euro', symbol: '€' },
      'Tokyo': { name: 'Yen Japonés', symbol: '¥' }
    };

    if (currencyMap[this.city]) {
      this.currencyName = currencyMap[this.city].name;
      this.currencySymbol = currencyMap[this.city].symbol;
    } else {
      this.currencyName = 'Desconocido';
      this.currencySymbol = '-';
    }
  }

  private fetchWeather(): void {
    console.log("🌍 Buscando clima para:", this.city);
    this.apiService.getWeather(this.city).subscribe(
      (data) => {
        console.log("✅ Respuesta de API Clima:", data);

        if (data?.main && data?.weather) {
          this.weather = {
            temperature: data.main.temp,
            description: data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
          };

          console.log("🔹 Datos de clima asignados:", this.weather);
        } else {
          console.error("❌ Error: Datos de clima no encontrados.");
        }
      },
      (error) => console.error("❌ Error obteniendo el clima:", error)
    );
  }

  private fetchCurrency(): void {
    const currencyCode = this.getCurrencyCode(this.city);
    this.apiService.getExchangeRate('COP', currencyCode).subscribe(
      (data) => {
        console.log("✅ Respuesta de API Cambio de Moneda:", data);

        if (data?.conversion_rates?.[currencyCode]) {
          this.exchangeRate = Number(data.conversion_rates[currencyCode].toFixed(5));
          this.convertedBudget = Number((this.budget * this.exchangeRate).toFixed(2));

          console.log("🔹 Conversión de moneda asignada:", {
            currencyName: this.currencyName,
            currencySymbol: this.currencySymbol,
            exchangeRate: this.exchangeRate,
            convertedBudget: this.convertedBudget
          });
          
          // Llamamos a saveTravel aquí, asegurándonos de que los datos sean correctos
          this.saveTravel();
        } else {
          console.error("❌ Error: No se encontró la tasa de cambio.");
        }
      },
      (error) => console.error("❌ Error obteniendo la tasa de cambio:", error)
    );
  }

  private saveTravel(): void {
    if (!this.weather || !this.weather.temperature) {
      console.error("❌ No se puede guardar, datos incompletos:", this.weather);
      return;
    }

    const travelData = {
      city: this.city,
      budget: this.budget,
      converted_budget: this.convertedBudget,
      exchange_rate: this.exchangeRate,
      temperature: this.weather.temperature,
      currency_name: this.currencyName,
      currency_symbol: this.currencySymbol
    };

    console.log("🟢 Enviando datos al backend:", JSON.stringify(travelData, null, 2));

    this.travelService.createTravel(travelData).subscribe(
      response => {
        console.log("✅ Datos guardados en BD:", response);
      },
      error => {
        console.error("❌ Error al guardar los datos en BD:", error);
      }
    );
  }

  private getCurrencyCode(city: string): string {
    const currencyMap: { [key: string]: string } = {
      'London': 'GBP',
      'New York': 'USD',
      'Paris': 'EUR',
      'Tokyo': 'JPY',
      'Madrid': 'EUR'
    };
    return currencyMap[city] || 'EUR';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
