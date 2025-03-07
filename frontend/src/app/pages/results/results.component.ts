import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

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

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {
    this.route.queryParams.subscribe(params => {
      console.log("🟢 Parámetros recibidos en Results:", params);

      this.city = this.formatCity(params['city']);
      this.budget = Number(params['budget']);

      if (!this.validarEntrada()) {
        alert("❌ Datos inválidos. Regresando a inicio.");
        this.router.navigate(['/']);
        return;
      }

      this.fetchWeather();
      this.fetchCurrency();
    });
  }

  /**
   * 🔹 Validar entrada antes de llamar APIs
   */
  private validarEntrada(): boolean {
    return this.city.trim() !== '' && this.budget > 0 && !isNaN(this.budget);
  }

  /**
   * 🔹 Formatear el nombre de la ciudad para que coincida con las APIs
   */
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

  /**
   * 🔹 Obtener datos climáticos
   */
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
        } else {
          console.error("❌ Error: Datos de clima no encontrados.");
        }
      },
      (error) => console.error("❌ Error obteniendo el clima:", error)
    );
  }

  /**
   * 🔹 Obtener tasa de cambio de moneda y conversión de presupuesto
   */
  private fetchCurrency(): void {
    const currencyCode = this.getCurrencyCode(this.city);

    this.apiService.getExchangeRate('COP', currencyCode).subscribe(
      (data) => {
        console.log("✅ Respuesta de API Cambio de Moneda:", data);

        if (data?.conversion_rates?.[currencyCode]) {
          this.currencyName = this.getCurrencyName(this.city);
          this.currencySymbol = this.getCurrencySymbol(this.city);
          this.exchangeRate = Number(data.conversion_rates[currencyCode].toFixed(5));
          this.convertedBudget = Number((this.budget * this.exchangeRate).toFixed(2));
        } else {
          console.error("❌ Error: No se encontró la tasa de cambio.");
        }
      },
      (error) => console.error("❌ Error obteniendo la tasa de cambio:", error)
    );
  }

  /**
   * 🔹 Obtener código de moneda según la ciudad
   */
  private getCurrencyCode(city: string): string {
    const currencyMap: { [key: string]: string } = {
      'london': 'GBP',
      'new york': 'USD',
      'paris': 'EUR',
      'tokyo': 'JPY',
      'madrid': 'EUR'
    };
    return currencyMap[city.toLowerCase()] || 'EUR';
  }

  /**
   * 🔹 Obtener nombre de la moneda según la ciudad
   */
  private getCurrencyName(city: string): string {
    const currencyNames: { [key: string]: string } = {
      'london': 'Libra Esterlina',
      'new york': 'Dólar Americano',
      'paris': 'Euro',
      'tokyo': 'Yen Japonés',
      'madrid': 'Euro'
    };
    return currencyNames[city.toLowerCase()] || 'Euro';
  }

  /**
   * 🔹 Obtener símbolo de la moneda según la ciudad
   */
  private getCurrencySymbol(city: string): string {
    const currencySymbols: { [key: string]: string } = {
      'london': '£',
      'new york': '$',
      'paris': '€',
      'tokyo': '¥',
      'madrid': '€'
    };
    return currencySymbols[city.toLowerCase()] || '€';
  }

  /**
   * 🔹 Regresar a la pantalla de inicio
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
