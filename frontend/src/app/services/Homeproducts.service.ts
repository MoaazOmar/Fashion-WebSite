import { Product } from '../../interfaces/product.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeProductsService {
  private baseUrl = 'http://localhost:3000'; 

  constructor(private _http: HttpClient) { }
  private apiUrl = 'http://localhost:3000';
  getProducts(gender: string = '', limit: number = 3, skip: number = 0): Observable<Product[]> {
    let url = `${this.apiUrl}/?limit=${limit}&skip=${skip}`;
    if (gender) {
      url += `&gender=${gender}`;
    }
    console.log('API URL:', url); // Debugging: Log the constructed URL
    return this._http.get<Product[]>(url, { withCredentials: true });
  }}