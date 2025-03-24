import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order } from '../../interfaces/order.model';
import { DashboardStats } from '../../interfaces/dashboard.model';
import { Product } from '../../interfaces/product.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard-stats`, { withCredentials: true });
  }

  getRecentOrders(): Observable<Order[]> {
    return this.http.get<{ orders: Order[] }>(`${this.apiUrl}/orders`, { withCredentials: true }).pipe(
      map(response => response.orders)
    );
  }

  getTopSellingProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/top-selling-products`, { withCredentials: true });
  }

  addProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, formData, { withCredentials: true });
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<{ products: Product[] }>(`${this.apiUrl}/productList`, { withCredentials: true }).pipe(
      map(response => response.products)
    );
  }

  updateProduct(productId: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/productList/update`, formData, { withCredentials: true });
  }
}