import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather`;
  private exchangeApiUrl = `https://v6.exchangerate-api.com/v6`;

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    const url = `${this.weatherApiUrl}?q=${city}&appid=${environment.openWeatherApiKey}&units=metric&lang=es`;
    return this.http.get(url);
  }

  getExchangeRate(baseCurrency: string, targetCurrency: string): Observable<any> {
    const url = `${this.exchangeApiUrl}/${environment.exchangeRateApiKey}/latest/${baseCurrency}`;
    return this.http.get(url);
  }
}
