import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage: string;

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Network Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 400: errorMessage = 'Invalid request. Please check your data.'; break;
          case 401: errorMessage = 'Session expired. Please log in again.'; break;
          case 403: errorMessage = 'You do not have permission for this action.'; break;
          case 404: errorMessage = 'The requested resource was not found.'; break;
          case 500: errorMessage = 'Internal server error. Please try again later.'; break;
          default: errorMessage = `Unexpected error (${error.status}): ${error.message}`;
        }
      }

      snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });

      return throwError(() => error);
    })
  );
};