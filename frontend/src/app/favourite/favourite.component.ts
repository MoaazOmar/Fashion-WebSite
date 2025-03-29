import { Component, OnInit } from '@angular/core';
import { AddFavoriteService } from '../services/addFavourites.porducts.service';
import { SingleProductService } from '../services/single-product.service';
import { AuthService } from '../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map operator
import { Product } from '../../interfaces/product.model';
import { CartService } from '../services/cart.service';

interface FavoriteItem {
  color: any;
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  dateAdded: Date;
}

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css']
})
export class FavouriteComponent implements OnInit {
  favorites: FavoriteItem[] = [];
  sortBy: string = 'newest';
  filterBy: string = 'all';
  favoriteItems$!: Observable<Product[]>;

  constructor(
    private addFavoriteService: AddFavoriteService,
    private productService: SingleProductService,
    private authService: AuthService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.favoriteItems$ = this.addFavoriteService.love$.pipe(
      map(() => this.addFavoriteService.getLove())
    );
  
    this.favoriteItems$.subscribe(products => {
      this.favorites = products.map(product => ({
        id: product._id,
        name: product.name,
        image: product.image && product.image.length > 0 ? product.image[0] : 'default-image.jpg',
        price: product.price,
        category: product.category,
        dateAdded: product.dateAdded ? new Date(product.dateAdded) : new Date(),
        color: product.selectedColor || (product.colors && product.colors[0]) || 'default' // Add this
      }));
      this.cdr.detectChanges();
    });
  
    this.favorites = this.addFavoriteService.getLove().map(product => ({
      id: product._id,
      name: product.name,
      image: product.image && product.image.length > 0 ? product.image[0] : 'default-image.jpg',
      price: product.price,
      category: product.category,
      dateAdded: product.dateAdded ? new Date(product.dateAdded) : new Date(),
      color: product.selectedColor || (product.colors && product.colors[0]) || 'default' // Add this
    }));
  }
  
  addToCartAndRemove(item: FavoriteItem): void {
    const cartItem = {
      productID: item.id,
      amount: 1, // Default to 1, adjust as needed
      price: item.price,
      name: item.name,
      image: item.image,
      color:item.color,
    };
    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        console.log('Added to cart:', item.name);
        this.removeFromFavorites(item.id); // Remove from favorites after adding to cart
      },
      error: (err) => console.error('Error adding to cart:', err)
    });
  }


  removeFromFavorites(id: string): void {
    this.addFavoriteService.removeLoveProduct(id);
    console.log(`Removed favorite with id ${id}.`);
  }

  getFilteredFavorites(): FavoriteItem[] {
    let filtered = [...this.favorites];

    if (this.filterBy !== 'all') {
      filtered = filtered.filter(item => item.category === this.filterBy);
    }

    switch (this.sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.dateAdded.getTime() - b.dateAdded.getTime());
        break;
      case 'priceAsc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }

  resetFilters(): void {
    this.filterBy = 'all';
    this.sortBy = 'newest';
  }
}