import { Observable } from 'rxjs';
import { Weather } from '../models/weather.model';

export abstract class WeatherRepository {
  abstract getWeather(city: string): Observable<Weather>;
}