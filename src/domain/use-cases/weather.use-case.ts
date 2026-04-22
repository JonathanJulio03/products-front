import { Injectable, inject, signal, computed } from '@angular/core';
import { WeatherRepository } from '../ports/weather.repository';
import { firstValueFrom } from 'rxjs';
import { Weather } from '../models/weather.model';

@Injectable({ providedIn: 'root' })
export class WeatherUseCase {
  private readonly repository = inject(WeatherRepository);

  private readonly state = signal<{ data: Weather | null; loading: boolean; city: string }>({
    data: null,
    loading: false,
    city: 'london'
  });

  public weather = computed(() => this.state().data);
  public isLoading = computed(() => this.state().loading);
  public currentCity = computed(() => this.state().city);

  async updateCity(newCity: string): Promise<void> {
    this.state.update(s => ({ ...s, city: newCity, loading: true }));

    try {
      const data = await firstValueFrom(this.repository.getWeather(newCity));
      this.state.update(s => ({ ...s, data, loading: false }));
    } catch (error) {
      console.error('UseCase: Error ', error);
      this.state.update(s => ({ ...s, data: null, loading: false }));
    }
  }
}