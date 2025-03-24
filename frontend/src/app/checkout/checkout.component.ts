import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './../services/cart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from './../services/order.service';
import { CartItem } from './../../interfaces/cart.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit {
  cart: CartItem[] = []; // Cart state
  formUser = new FormGroup({
    customerName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required])
  });

  constructor(private _cartService: CartService, private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this._cartService.getCartItems().subscribe({
        next: (response: any) => {
            console.log('Cart response:', response);
            if (response && response.items) {
                this.cart = response.items;
                console.log('Cart items set:', this.cart);
            } else {
                console.warn('Cart empty or items not found.');
            }
        },
        error: (err) => {
            console.error('Error fetching cart items:', err);
        }
    });
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + item.price * item.amount, 0);
  }

  onSubmit() {
    if (this.formUser.invalid) {
      console.error('Form is invalid');
      return;
    }

    this.orderService.createOrder({
      customerName: this.formUser.value.customerName!,
      address: this.formUser.value.address!
    }).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
      },
      error: (err) => {
        console.error('Error creating order:', err);
      }
    });
    this.clearCart()
  }

  clearCart(): void {
    this._cartService.clearCartItems().subscribe({
      next: () => {
        console.log('Cart cleared successfully');
        this.cart = []; // Update local cart state
        this.router.navigate(['/success']);
      },
      error: (err) => {
        console.error('Error clearing cart:', err);
        alert('Failed to clear cart. Please try again.');
      }
    });
  }

}
