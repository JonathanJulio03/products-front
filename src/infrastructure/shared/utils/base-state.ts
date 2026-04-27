import { signal, computed, Signal } from '@angular/core';

export class BaseState<T> {
  protected readonly state;

  constructor(initialState: T) {
    this.state = signal<T>(initialState);
  }

  protected updateState(partialState: Partial<T>): void {
    this.state.update(s => ({ ...s, ...partialState }));
  }

  protected select<K>(selector: (state: T) => K): Signal<K> {
    return computed(() => selector(this.state()));
  }
}