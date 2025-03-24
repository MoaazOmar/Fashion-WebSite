import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { CartItem } from '../../interfaces/cart.model';
import { NotificationCartService } from './notification-cart.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';
  private currentCartItems = new BehaviorSubject<CartItem[]>([]);
  currentCartItems$ = this.currentCartItems.asObservable();

  constructor(private http: HttpClient, private notificationService: NotificationCartService) { }

  // Preserve cart items for checkout
  preserveCartItems(items: CartItem[]): void {
    this.currentCartItems.next(items);
  }

  // Add a product to the cart
  addToCart(cartItem: CartItem): Observable<any> {
    const currentItems = this.currentCartItems.getValue();
    const existingCartItem = currentItems.find(item => item.productID === cartItem.productID);
    
    if (existingCartItem) {
      const newAmount = existingCartItem.amount + cartItem.amount;
      return this.updateCartItem(existingCartItem._id, newAmount).pipe(
        tap(() => {
          this.getCartItems().subscribe();
        })
      );
    } else {
      return this.http.post(`${this.apiUrl}/`, cartItem, { withCredentials: true }).pipe(
        tap((response) => {
          console.log('addToCart response:', response);
          this.getCartItems().subscribe();
          this.notificationService.showNotification("Item added to cart", 'success');
        })
      );
    }
  }
  
  // Get all cart items
  getCartItems(): Observable<CartItem[]> {
    return this.http.get<any>(`${this.apiUrl}/`, { withCredentials: true }).pipe(
      map(response => response.items),
      tap(items => this.currentCartItems.next(items))
    );
  }
  
  // Update the quantity of a cart item
  updateCartItem(cartId: any, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, { cartId, amount }, { withCredentials: true }).pipe(
      tap(() => {
        this.getCartItems().subscribe();
        this.notificationService.showNotification("Cart item updated", 'updated');
      })
    );
  }
  
  // Delete a single cart item
  deleteCartItem(cartId: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete`, { cartId }, { withCredentials: true }).pipe(
      tap(() => {
        this.getCartItems().subscribe();
        this.notificationService.showNotification("Item removed from cart", 'delete');
      })
    );
  }
  
  // Clear all cart items for the logged-in user
  clearCartItems(): Observable<any> {
    return this.http.post(`${this.apiUrl}/clear`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.currentCartItems.next([]);
        this.notificationService.showNotification("Cart cleared", 'info');
      })
    );
  }
}
