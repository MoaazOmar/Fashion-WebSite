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
  cart: CartItem[] = [];
  formUser = new FormGroup({
    customerName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required])
  });

  constructor(
    private _cartService: CartService,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this._cartService.getCartItems().subscribe({
      next: (response: CartItem[]) => {
        console.log('Cart response:', response);
        this.cart = response;
        console.log('Cart items set:', this.cart);
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
        this.cart = []; 
        this.router.navigate(['/success']);
      },
      error: (err) => {
        console.error('Error creating order:', err);
      }
    });
  }
}