import { BadRequestError } from '../common/bad-request-error';
import { NotFoundError } from '../common/not-found-error';
import { AppError } from '../common/app-error';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private url: string, private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.url).pipe(catchError(this.handelError));
  }

  create(resource): Observable<any> {
    return this.http
      .post(this.url, resource)
      .pipe(catchError(this.handelError));
  }

  update(resource): Observable<any> {
    return this.http
      .patch(this.url + `/${resource.id}`, resource)
      .pipe(catchError(this.handelError));
  }

  delete(id: number): Observable<any> {
    return this.http
      .delete(this.url + `/${id}`)
      .pipe(catchError(this.handelError));
  }

  private handelError(err: Response) {
    if (err.status == 400) return throwError(new BadRequestError(err));

    if (err.status == 404) return throwError(new NotFoundError(err));

    return throwError(new AppError(err));
  }
}
