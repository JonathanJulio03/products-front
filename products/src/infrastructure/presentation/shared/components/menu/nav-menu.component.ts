import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WeatherUseCase } from '../../../../../domain/use-cases/weather.use-case';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [FormsModule, MatToolbarModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatInputModule, MatFormFieldModule],
  template: `
    <mat-toolbar color="primary" class="nav-container">
      <div class="menu-links">
        <a mat-button routerLink="/products">Products</a>
      </div>

      <span class="spacer"></span>

      <div class="weather-section">
        @if (weatherUseCase.isLoading()) {
          <mat-spinner diameter="20"></mat-spinner>
        } @else {
          <mat-form-field appearance="outline" class="city-input">
            <mat-icon matPrefix>location_on</mat-icon>
            <input matInput 
                   #cityInput
                   [value]="weatherUseCase.currentCity()" 
                   (keydown.enter)="changeCity(cityInput.value)"
                   placeholder="Change city...">
          </mat-form-field>

          @if (weatherUseCase.weather(); as w) {
            <div class="weather-display">
              <span class="temp">{{ w.temperatureCelsius }}°C</span>
              <small>{{ w.region }}</small>
            </div>
          }
        }
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .nav-container { display: flex; align-items: center; }
    .spacer { flex: 1 1 auto; }
    .weather-section { display: flex; align-items: center; gap: 15px; }
    
    .city-input { 
      width: 150px; 
      height: 40px; 
      --mdc-filled-tonal-container-color: rgba(255,255,255,0.1);
      font-size: 12px;
    }
    :deep(.mat-mdc-form-field-subscript-wrapper) { display: none; }
    
    .weather-display { display: flex; flex-direction: column; line-height: 1; }
    .temp { font-weight: bold; font-size: 16px; }
  `]
})
export class NavMenuComponent implements OnInit {
  public weatherUseCase = inject(WeatherUseCase);

  ngOnInit() {
    this.weatherUseCase.updateCity('london');
  }

  changeCity(cityName: string): void {
    const cleanCity = cityName?.trim();
    if (cleanCity) {
      this.weatherUseCase.updateCity(cleanCity);
    }
  }
}