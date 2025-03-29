import { Component, OnInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../interfaces/product.model';
import { ShoppinglistService } from '../services/shoppinglist.service';
import { CartService } from '../services/cart.service'; // Added for cart functionality
import { Set } from '../../interfaces/distinctAndCount.model';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css'],
  animations: [
    trigger('slideAnimation', [
      state('inactive', style({
        opacity: 0,
        transform: 'scale(1.1)'
      })),
      state('active', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('previous', style({
        opacity: 0,
        transform: 'scale(0.9)'
      })),
      transition('inactive => active', [
        animate('1.2s cubic-bezier(0.42, 0, 0.58, 1)')
      ]),
      transition('active => previous', [
        animate('1.2s cubic-bezier(0.42, 0, 0.58, 1)')
      ]),
      transition('previous => inactive', [
        animate('0s')
      ]),
      transition('active => inactive', [
        animate('1.2s cubic-bezier(0.42, 0, 0.58, 1)')
      ])
    ])
  ]
})
export class ShoppingComponent implements OnInit, OnDestroy {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  @ViewChild('progressBar', { static: false }) progressBar!: ElementRef;

  intervalTime = 8000; // 8 seconds
  currentSlideIndex = 0;
  previousSlideIndex = -1;
  interval: any;
  progressInterval: any;

  // Products
  carouselProducts: Product[] = [];
  allProducts: Product[] = [];
  currentPage = 1;
  totalPages: number[] = [];
  productsPerPage = 4;
  searchTerm = '';
  selectedSort = 'newest';
  selectedColor = '';
  colors: string[] = [];
  uniqueCategories: Set[] = [];
  selectedCategory: string = '';
  DisplayingfullProductsNumber: number = 0;
  uniqueColors: Set[] = [];

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ShoppinglistService,
    private cartService: CartService // Added CartService for adding items to cart
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 1;
      this.productsPerPage = +params['limit'] || 4;
      this.selectedSort = params['sort'] || 'newest';
      this.searchTerm = params['search'] || '';
      this.selectedColor = params['color'] || '';
      this.selectedCategory = params['category'] || '';
      this.loadCombinedProducts(params['gender']);
    });
    this.startAutoSlide();
    this.setupTouchEvents();
  }

  private loadCombinedProducts(gender?: string): void {
    const params = {
      gender: gender || 'all',
      page: this.currentPage,
      limit: this.productsPerPage,
      sort: this.selectedSort,
      search: this.searchTerm,
      color: this.selectedColor,
      category: this.selectedCategory
    };

    this.productService.getCombinedProducts(params).subscribe({
      next: (response: any) => {
        this.carouselProducts = response.carouselProducts.map((product: Product) => ({
          ...product,
          image: product.image.map(img => `http://localhost:3000/images/${img}`),
          description: product.description || 'Discover this stylish item from our collection.',
          comments: product.comments || [] // Ensure comments are included
        }));
        
        this.allProducts = response.products.map((product: Product) => ({
          ...product,
          image: product.image.map(img => `http://localhost:3000/images/${img}`),
        }));
        console.log('carouselProducts recieved',this.carouselProducts )
        this.totalPages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
        this.currentPage = response.currentPage;
        this.uniqueCategories = response.categoriesWithCounts;
        this.DisplayingfullProductsNumber = this.uniqueCategories.reduce((total, category) => {
          return total + (category?.count || 0);
        }, 0);
        this.uniqueColors = response.colorsWithCounts;
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    clearInterval(this.progressInterval);
  }

  goToSlide(index: number): void {
    if (index === this.currentSlideIndex) return;

    this.previousSlideIndex = this.currentSlideIndex;
    this.currentSlideIndex = index;

    if (this.currentSlideIndex >= this.carouselProducts.length) {
      this.currentSlideIndex = 0;
    } else if (this.currentSlideIndex < 0) {
      this.currentSlideIndex = this.carouselProducts.length - 1;
    }

    setTimeout(() => {
      this.previousSlideIndex = -1; // Reset previous after transition
    }, 1200); // Matches 1.2s animation duration

    this.resetProgressBar();
  }

  nextSlide(): void {
    this.goToSlide(this.currentSlideIndex + 1);
  }

  prevSlide(): void {
    this.goToSlide(this.currentSlideIndex - 1);
  }

  startAutoSlide(): void {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, this.intervalTime);
    this.startProgressBar();
  }

  startProgressBar(): void {
    const progressBarEl = this.progressBar.nativeElement;
    this.renderer.setStyle(progressBarEl, 'width', '0%');
    clearInterval(this.progressInterval);

    let width = 0;
    const increment = 100 / (this.intervalTime / 20);

    this.progressInterval = setInterval(() => {
      if (width >= 100) {
        width = 0;
      } else {
        width += increment;
        this.renderer.setStyle(progressBarEl, 'width', `${width}%`);
      }
    }, 20);
  }

  resetProgressBar(): void {
    clearInterval(this.progressInterval);
    this.renderer.setStyle(this.progressBar.nativeElement, 'width', '0%');
    this.startProgressBar();
    clearInterval(this.interval);
    this.startAutoSlide();
  }

  setupTouchEvents(): void {
    let touchStartX = 0;
    let touchEndX = 0;

    const carouselEl = this.carousel.nativeElement;

    this.renderer.listen(carouselEl, 'touchstart', (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    this.renderer.listen(carouselEl, 'touchend', (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  handleSwipe(startX: number, endX: number): void {
    const swipeThreshold = 50;
    if (endX < startX - swipeThreshold) {
      this.nextSlide();
    }
    if (endX > startX + swipeThreshold) {
      this.prevSlide();
    }
  }

  // Cart Functionality
  addToCart(product: Product): void {
    const cartItem = {
      productID: product._id,
      name: product.name,
      price: product.price,
      amount: 1, // Default quantity
      image: product.image[0],
      color: product.colors?.[0] || '', // Default to first color
      userID: 'currentUserId' // Replace with actual user ID from auth service if available
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: () => console.log(`${product.name} added to cart`),
      error: (err) => console.error('Error adding to cart:', err)
    });
  }

  // Rating/Comments Functionality (Preserved from productslist.component.ts)
  getAverageRating(product: Product): number {
    const ratedComments = product.comments.filter(comment => comment.rating !== null);
    if (ratedComments.length === 0) return 0;
    const totalRating = ratedComments.reduce((sum, comment) => sum + (comment.rating || 0), 0);
    return totalRating / ratedComments.length;
  }

  getTotalRatedComments(product: Product): number {
    return product.comments.filter(comment => comment.rating !== null).length;
  }

  getStarClass(product: Product, i: number): string {
    const average = this.getAverageRating(product);
    if (i <= average) {
      return 'fas fa-star text-yellow-400';
    } else if (i - 0.5 <= average) {
      return 'fas fa-star-half-alt text-yellow-400';
    } else {
      return 'far fa-star text-yellow-400';
    }
  }
}