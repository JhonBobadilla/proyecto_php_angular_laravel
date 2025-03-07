import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TravelService {
  private apiUrl = 'http://127.0.0.1:8000/api/travels';

  constructor(private http: HttpClient) {}

  createTravel(travelData: any): Observable<any> {
    console.log("🟢 Intentando enviar datos al backend:", travelData);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.apiUrl, travelData, { headers });
  }
}


