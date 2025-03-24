import { Component, OnInit } from '@angular/core';
import {ShoppinglistService} from './../../services/shoppinglist.service';
import { Product } from '../../../interfaces/product.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-carousel',
  templateUrl: './products-carousel.component.html',
  styleUrl: './products-carousel.component.css'
})
export class ProductsCarouselComponent implements OnInit {
  mostLikedProducts: Product[] = [];
  mostRecentProducts: Product[] = [];
  currentLikedIndex = 0;
  currentRecentIndex = 0;
  autoSlideTimer: any;
  currentIndex = 0;
  constructor(private _shoppinglistService:ShoppinglistService ,
              private route: ActivatedRoute
  ){}
  ngOnInit() {
    this.startAutoSlide();
    this.route.queryParams.subscribe(param => {
      this.fetchCarouselProducts(param['gender']);
    })
    
  }
// In products-carousel.component.ts
fetchCarouselProducts(gender: string) {
  const params = {
    gender: gender || 'all',
  }
  
  this._shoppinglistService.getCombinedProducts(params).subscribe({
    next: (response: any) => {
      this.mostLikedProducts = response.mostLikedProducts.map((product: Product) => ({
        ...product,
        image: `http://localhost:3000/images/${product.image}`
      }));
      this.mostRecentProducts = response.mostRecentProducts.map((product:Product)=> ({
        ...product,
        image: `http://localhost:3000/images/${product.image}`
      }))
    },
    error: (err) => {
      console.error('Error fetching products:', err); // Add error handling
    }
  });
}  ngOnDestroy() {
    clearInterval(this.autoSlideTimer);
  }
  
  startAutoSlide() {
    this.autoSlideTimer = setInterval(() => {
      this.nextLiked();
      this.nextRecent();
    }, 5000);
  }

  resetTimer() {
    clearInterval(this.autoSlideTimer);
    this.startAutoSlide();
  }

  prevLiked() {
    this.currentLikedIndex =
      this.currentLikedIndex === 0 ? this.mostLikedProducts.length - 1 : this.currentLikedIndex - 1;
    this.resetTimer();
  }

  nextLiked() {
    this.currentLikedIndex =
      this.currentLikedIndex === this.mostLikedProducts.length - 1 ? 0 : this.currentLikedIndex + 1;
    this.resetTimer();
  }

  prevRecent() {
    this.currentRecentIndex =
      this.currentRecentIndex === 0 ? this.mostRecentProducts.length - 1 : this.currentRecentIndex - 1;
    this.resetTimer();
  }

  nextRecent() {
    this.currentRecentIndex =
      this.currentRecentIndex === this.mostRecentProducts.length - 1 ? 0 : this.currentRecentIndex + 1;
    this.resetTimer();
  }

  goToLiked(index: number) {
    this.currentLikedIndex = index;
    this.resetTimer();
  }

  goToRecent(index: number) {
    this.currentRecentIndex = index;
    this.resetTimer();
  }
}
