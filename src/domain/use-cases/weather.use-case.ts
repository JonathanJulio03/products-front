import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, switchMap, tap, distinctUntilChanged } from 'rxjs';
import { catchAndKeepAlive } from '../../infrastructure/shared/operators/catch-and-keep-alive.operator';
import { BaseState } from '../../infrastructure/shared/utils/base-state';
import { Weather } from '../models/weather.model';
import { WeatherRepository } from '../ports/weather.repository';

interface WeatherState {
  data: Weather | null;
  loading: boolean;
  city: string;
}

@Injectable({ providedIn: 'root' })
export class WeatherUseCase extends BaseState<WeatherState> {
  private readonly repository = inject(WeatherRepository);
  private readonly destroyRef = inject(DestroyRef);

  public weather = this.select(s => s.data);
  public isLoading = this.select(s => s.loading);
  public currentCity = this.select(s => s.city);

  private readonly searchCityAction$ = new Subject<string>();

  constructor() {
    super({ data: null, loading: false, city: 'london' });
    this.initSearchPipeline();
  }

  private initSearchPipeline(): void {
    this.searchCityAction$.pipe(
      distinctUntilChanged(),
      tap(city => this.updateState({ city, loading: true })),
      switchMap(city => this.repository.getWeather(city).pipe(
        tap(data => this.updateState({ data, loading: false })),
        catchAndKeepAlive(err => {
          console.error('Error fetching weather:', err);
          this.updateState({ data: null, loading: false });
        })
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  updateCity(newCity: string): void {
    const cleanCity = newCity?.trim().toLowerCase();
    if (cleanCity) this.searchCityAction$.next(cleanCity);
  }
}