import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [FormsModule], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  selectedCity: string = '';
  budget: number | null = null;

  constructor(private router: Router) {}

  consultar() {
    console.log("🟢 Función consultar() ejecutada.");
    console.log("Ciudad seleccionada:", this.selectedCity);
    console.log("Presupuesto ingresado:", this.budget);

    if (!this.selectedCity) {
      alert("Debe seleccionar una ciudad.");
      return;
    }

    if (this.budget === null || this.budget <= 0 || isNaN(this.budget)) {
      alert("Ingrese un presupuesto válido en COP.");
      return;
    }

    console.log("🟢 Navegando a /results con parámetros:", {
      city: this.selectedCity,
      budget: this.budget
    });

    this.router.navigate(['/results'], {
      queryParams: { city: this.selectedCity, budget: this.budget }
    });
  }
}
