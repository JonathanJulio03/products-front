import { catchError, EMPTY, Observable } from 'rxjs';

export function catchAndKeepAlive<T>(
  actionOnError: (error: any) => void
) {
  return catchError((err: any, caught: Observable<T>) => {
    actionOnError(err);
    return EMPTY;
  });
}