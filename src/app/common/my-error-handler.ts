import { ErrorHandler } from '@angular/core';

export class MyErrorHandler extends ErrorHandler {
  handleError(err: any) {
    alert('An unexpected error occured.');
  }
}
