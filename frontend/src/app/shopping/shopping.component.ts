import { Component, OnInit, OnDestroy, Renderer2, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../interfaces/product.model';
import { ShoppinglistService } from '../services/shoppinglist.service';
import {Set} from '../../interfaces/distinctAndCount.model'
@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit, OnDestroy {
  intervalTime = 8000; // 8 seconds
  countdownTime = this.intervalTime / 1000; // Convert to seconds
  currentTime = this.countdownTime;
  interval: any;
  countdownInterval: any;

  // Products And Carousel Products
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
  DisplayingfullProductsNumber:number = 0;
  uniqueColors: Set[] = [];
  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ShoppinglistService,
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
    this.startAutoSlide(); // Start the auto-slide interval
    this.resetCountdown(); // Initialize the countdown timer
    this.setupEventListeners(); // Set up event listeners for next/prev buttons
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
        console.log('Response:', response); 
        this.carouselProducts = response.carouselProducts.map((product: Product) => ({
          ...product,
          image: `http://localhost:3000/images/${product.image}`
        }));
        this.allProducts = response.products.map((product: Product) => ({
          ...product,
          image: `http://localhost:3000/images/${product.image}`
        }));
        this.totalPages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
        this.currentPage = response.currentPage;
        this.uniqueCategories = response.categoriesWithCounts
        this.DisplayingfullProductsNumber = this.uniqueCategories.reduce((total, category) => {
          return total + (category?.count || 0);
        }, 0);
        this.uniqueColors  = response.colorsWithCounts
    
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  // Carousel Code 

  ngOnDestroy(): void {
    // Clear intervals to avoid memory leaks
    clearInterval(this.interval);
    clearInterval(this.countdownInterval);
  }

  resetCountdown(): void {
    const countdownDom = document.querySelector('.countdown') as HTMLElement;
    const progressCircle = document.querySelector('.counter circle') as SVGCircleElement;

    // Reset the countdown time
    this.currentTime = this.countdownTime;
    countdownDom.textContent = this.currentTime.toString();

    // Reset the progress circle animation
    this.renderer.setStyle(progressCircle, 'transition', 'none');
    this.renderer.setStyle(progressCircle, 'strokeDashoffset', '0');

    // Clear the existing countdown interval
    clearInterval(this.countdownInterval);

    // Start a new countdown interval
    this.countdownInterval = setInterval(() => {
      this.currentTime--;
      countdownDom.textContent = this.currentTime.toString();

      // Stop the countdown when it reaches 0
      if (this.currentTime <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);

    // Restart the progress circle animation after a short delay
    setTimeout(() => {
      this.renderer.setStyle(progressCircle, 'transition', `stroke-dashoffset ${this.intervalTime}ms linear`);
      this.renderer.setStyle(progressCircle, 'strokeDashoffset', '126');
    }, 50);
  }

  showSlider(type: 'next' | 'prev'): void {
    const listItemDom = document.querySelector('.carousel .list') as HTMLElement;
    const thumbnailDom = document.querySelector('.carousel .thumnail') as HTMLElement;
    const itemSlider = document.querySelectorAll('.carousel .list .item');
    const imgThumbnail = document.querySelectorAll('.carousel .thumnail .item');
    const carouselDom = document.querySelector('.carousel') as HTMLElement;

    if (type === 'next') {
      // Move the first item to the end of the list
      listItemDom.appendChild(itemSlider[0]);
      thumbnailDom.appendChild(imgThumbnail[0]);
      carouselDom.classList.add('next');
      carouselDom.classList.remove('prev');
    } else {
      // Move the last item to the beginning of the list
      const positionLastItem = itemSlider.length - 1;
      listItemDom.prepend(itemSlider[positionLastItem]);
      thumbnailDom.prepend(imgThumbnail[positionLastItem]);
      carouselDom.classList.add('prev');
      carouselDom.classList.remove('next');
    }

    // Remove the transition classes after the animation is complete
    setTimeout(() => {
      carouselDom.classList.remove('next', 'prev');
    }, 1000);

    // Reset the countdown and auto-slide interval
    this.resetCountdown();
    this.resetAutoSlideInterval();
  }

  startAutoSlide(): void {
    // Start the auto-slide interval
    this.interval = setInterval(() => {
      this.showSlider('next');
    }, this.intervalTime);
  }

  resetAutoSlideInterval(): void {
    // Clear the existing auto-slide interval
    clearInterval(this.interval);
    // Start a new auto-slide interval
    this.startAutoSlide();
  }

  setupEventListeners(): void {
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');

    // Add event listeners for next and prev buttons
    nextBtn?.addEventListener('click', () => this.showSlider('next'));
    prevBtn?.addEventListener('click', () => this.showSlider('prev'));
  }
}