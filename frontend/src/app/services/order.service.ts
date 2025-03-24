import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  [x: string]: any;
  private apiUrl = 'http://localhost:3000/order';
  constructor(private http:HttpClient) { }
  createOrder(orderData:{ customerName: string, address: string }){
    // return this.http.post(`${this.apiUrl}/create` , orderData , {withCredentials:true})
    return this.http.post(`${this.apiUrl}/create`, orderData, { withCredentials: true });

  }
  getOrderToDisplay():Observable<any>{
    return this.http.get(`${this.apiUrl}/` , {withCredentials:true})
  }
}
