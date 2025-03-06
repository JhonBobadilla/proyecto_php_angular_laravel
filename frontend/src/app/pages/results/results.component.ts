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
      console.log("🟢 Parámetros recibidos en Results:\n", JSON.stringify(params, null, 2));

      this.city = this.formatCity(params['city']); // ✅ Se corrige el formato de la ciudad antes de llamar la API
      this.budget = Number(params['budget']);

      if (this.city && this.budget > 0) {
        this.fetchWeather();
        this.fetchCurrency();
      } else {
        alert("❌ Datos inválidos. Regresando a inicio.");
        this.router.navigate(['/']);
      }
    });
  }

  // ✅ Función para corregir nombres de ciudades antes de hacer la solicitud a la API
  formatCity(city: string): string {
    const cityMap: { [key: string]: string } = {
      'new-york': 'New York', 
      'london': 'London',
      'paris': 'Paris',
      'tokyo': 'Tokyo',
      'madrid': 'Madrid'
    };
    return cityMap[city.toLowerCase()] || city; // Si la ciudad no está en la lista, devolver la original
  }

  fetchWeather() {
    console.log("🌍 Buscando clima para:", this.city);
    
    this.apiService.getWeather(this.city).subscribe(
      (data) => {
        console.log("✅ Respuesta de API Clima:\n", JSON.stringify(data, null, 2));

        if (data && data.main && data.weather) {
          this.weather = {
            temperature: data.main.temp, // 🌡️ Temperatura real
            description: data.weather[0].description, // 🌦️ Descripción del clima
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` // 🖼️ Ícono del clima
          };
        } else {
          console.error("❌ Error: Datos de clima no encontrados.");
        }
      },
      (error) => {
        console.error("❌ Error obteniendo el clima:\n", JSON.stringify(error, null, 2));
      }
    );
  }

  fetchCurrency() {
    const currencyCode = this.getCurrencyCode(this.city); // ✅ Obtener el código de la moneda según la ciudad

    this.apiService.getExchangeRate('COP', currencyCode).subscribe(
      (data) => {
        console.log("✅ Respuesta de API Cambio de Moneda:\n", JSON.stringify(data, null, 2));

        if (data && data.conversion_rates && data.conversion_rates[currencyCode]) {
          this.currencyName = this.getCurrencyName(this.city); // ✅ Obtener el nombre de la moneda
          this.currencySymbol = this.getCurrencySymbol(this.city); // ✅ Obtener el símbolo de la moneda
          this.exchangeRate = Number(data.conversion_rates[currencyCode].toFixed(5)); // ✅ Redondeo correcto
          this.convertedBudget = Number((this.budget * this.exchangeRate).toFixed(2)); // ✅ Redondeo a 2 decimales
        } else {
          console.error("❌ Error: No se encontró la tasa de cambio.");
        }
      },
      (error) => {
        console.error("❌ Error obteniendo la tasa de cambio:\n", JSON.stringify(error, null, 2));
      }
    );
  }

  getCurrencyCode(city: string): string {
    const currencyMap: { [key: string]: string } = {
      'london': 'GBP',  // Libra Esterlina
      'new york': 'USD', // Dólar Americano
      'paris': 'EUR',    // Euro
      'tokyo': 'JPY',    // Yen Japonés
      'madrid': 'EUR'    // Euro
    };
    return currencyMap[city.toLowerCase()] || 'EUR'; // Si no se encuentra, usar EUR por defecto
  }

  getCurrencyName(city: string): string {
    const currencyNames: { [key: string]: string } = {
      'london': 'Libra Esterlina',
      'new york': 'Dólar Americano',
      'paris': 'Euro',
      'tokyo': 'Yen Japonés',
      'madrid': 'Euro'
    };
    return currencyNames[city.toLowerCase()] || 'Euro';
  }

  getCurrencySymbol(city: string): string {
    const currencySymbols: { [key: string]: string } = {
      'london': '£',
      'new york': '$',
      'paris': '€',
      'tokyo': '¥',
      'madrid': '€'
    };
    return currencySymbols[city.toLowerCase()] || '€';
  }

  goBack() {
    this.router.navigate(['/']);
  }
}

