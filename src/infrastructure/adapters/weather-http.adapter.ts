import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherRepository } from '../../domain/ports/weather.repository';
import { Weather } from '../../domain/models/weather.model';
import { environment } from '../../environments/environment';

@Injectable()
export class WeatherHttpAdapter implements WeatherRepository {
  private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiWeathertUrl}`;

  getWeather(city: string): Observable<Weather> {
    return this.http.get<Weather>(`${this.apiUrl}?city=${city}`);
  }
}