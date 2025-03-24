import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeProductsService } from '../../services/Homeproducts.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../../interfaces/product.model';
import { CartItem } from '../../../interfaces/cart.model';

@Component({
  selector: 'app-product-home',
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.css'],
})
export class ProductHomeComponent implements OnInit {
  products: (Product & { amount?: number })[] = []; // Extend Product with optional amount
  selectedCategory: string = '';
  limit: number = 3;
  skip: number = 0;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productsService: HomeProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const gender = params['gender'] || '';
      if (gender !== this.selectedCategory) {
        this.selectedCategory = gender;
        this.loadProducts(this.selectedCategory, true);
      }
    });
  }

  loadProducts(category: string = this.selectedCategory, reset: boolean = false) {
    this.isLoading = true;
    if (reset) {
      this.products = [];
      this.skip = 0;
    }

    this.productsService.getProducts(category, this.limit, this.skip).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.products = [
            ...this.products,
            ...response.map((product) => ({
              ...product,
              image: product.image.map(img => `http://localhost:3000/uploads/${img}`), // Adjust for array
              amount: 1, // Default amount for ordering
            })),
          ];
        }
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category === 'all' ? '' : category;
    this.loadProducts(this.selectedCategory, true);
  }

  loadMore() {
    this.skip += this.limit;
    this.loadProducts(this.selectedCategory);
  }

  applyFilter(event: Event): void {
    event.preventDefault();
    this.router.navigate([], {
      queryParams: { gender: this.selectedCategory },
      queryParamsHandling: 'merge',
    });
    this.resetProducts();
  }

  resetProducts(): void {
    this.products = [];
    this.skip = 0;
    this.loadProducts(this.selectedCategory, true);
  }

  addToCart(product: Product & { amount?: number }) {
    const cartItem: CartItem = {
      productID: product._id,
      name: product.name,
      price: product.price,
      image: product.image[0], // Use first image
      amount: product.amount || 1,
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      },
    });
  }
}