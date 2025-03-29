import { CartService } from '../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../interfaces/cart.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private _cartService: CartService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    console.log('Loading cart items');
    this._cartService.getCartItems().subscribe({
      next: (items: CartItem[]) => { 
        console.log('Cart items fetched:', items);
        this.cartItems = items;
        this.cdr.detectChanges(); // Ensure UI updates
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
        alert('Failed to load cart items. Please try again');
      }
    });
  }

  onUpdateItem(cartId: any, newAmount: any): void {
    if (!cartId) {
      console.error('Invalid cart ID');
      return;
    }
    const numericAmount = parseInt(newAmount, 10);
    if (isNaN(numericAmount) || numericAmount < 1) {
      alert('Please enter a valid quantity (Minimum 1)');
      return;
    }
    console.log('Updating cartId:', cartId, 'Amount:', newAmount);
    this._cartService.updateCartItem(cartId, numericAmount).subscribe({
      next: () => {
        const item = this.cartItems.find(i => i._id === cartId);
        if (item) {
          item.amount = numericAmount;
          item.timestamp = Date.now();
          console.log('Item updated:', item);
        }
        alert('Quantity updated successfully');
        this.loadCartItems(); // Refresh cart items
      },
      error: (error) => {
        console.error('Update error:', error);
        alert('Failed to update quantity');
      }
    });
  }

  onDeleteItem(cartId: any): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this._cartService.deleteCartItem(cartId).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter(item => item._id !== cartId);
          alert('Item removed successfully');
          this.loadCartItems(); // Refresh cart items
        },
        error: (error) => {
          console.error('Delete error:', error);
          alert('Failed to remove item');
        }
      });
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this._cartService.clearCartItems().subscribe({
        next: () => {
          console.log('Cart cleared successfully');
          this.cartItems = [];
          alert('Your cart has been cleared successfully');
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
          alert('Failed to clear cart. Please try again.');
        }
      });
    }
  }

  preserveCart(): void {
    this._cartService.preserveCartItems(this.cartItems);
  }
}