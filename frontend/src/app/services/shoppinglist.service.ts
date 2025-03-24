import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppinglistService {
  private apiurl = 'http://localhost:3000/products/products/carousel';

  constructor(private http: HttpClient) {}

  getCombinedProducts(params: any): Observable<any> {
    let httpParams = new HttpParams()
      .set('page', params.page || 1)
      .set('limit', params.limit || 4);

    if (params.gender) httpParams = httpParams.set('gender', params.gender);
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.color) httpParams = httpParams.set('color', params.color);

    return this.http.get(this.apiurl, { params: httpParams });
  }
  
}
