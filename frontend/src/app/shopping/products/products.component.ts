import { CartService } from './../../services/cart.service';
import { Set } from './../../../interfaces/distinctAndCount.model';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../interfaces/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppinglistService } from '../../services/shoppinglist.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CartItem } from '../../../interfaces/cart.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  animations: [
    trigger('listAnimation', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('300ms ease-in')
      ]),
      transition('* => void', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class ProductsComponent implements OnInit {
  allProducts: Product[] = [];
  currentPage = 1;
  totalPages: number[] = [];
  productsPerPage = 5;
  searchTerm = '';
  selectedSort = 'newest';
  selectedColor = ''; // For filter
  colors: string[] = [];
  uniqueCategories: Set[] = [];
  selectedCategory: string = '';
  DisplayingfullProductsNumber: number = 0;
  uniqueColors: Set[] = [];
  isDropdownOpen: boolean = false;
  isColorDropdownOpen: boolean = false;
  isLoading: boolean = false; // Added loading state

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ShoppinglistService,
    private _CartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 1;
      this.productsPerPage = +params['limit'] || 5;
      this.selectedSort = params['sort'] || 'newest';
      this.searchTerm = params['search'] || '';
      this.selectedColor = params['color'] || '';
      this.selectedCategory = params['category'] || '';
      this.loadCombinedProducts(params['gender']);
    });

    document.addEventListener('click', (event) => {
      const optionContainer = document.querySelector('#options-container-for-Category');
      if (optionContainer && !optionContainer.contains(event.target as Node)) {
        this.isDropdownOpen = false;
      }
    });
  }

  private updateUrlParams(): void {
    const queryParams = {
      gender: this.route.snapshot.queryParams['gender'] || 'all',
      page: this.currentPage,
      limit: this.productsPerPage,
      sort: this.selectedSort,
      search: this.searchTerm || null,
      color: this.selectedColor || null,
      category: this.selectedCategory || null,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.cleanParams(queryParams),
      queryParamsHandling: 'merge'
    });
  }

  private cleanParams(params: any): any {
    const cleaned = { ...params };
    Object.keys(cleaned).forEach(key => {
      if (!cleaned[key] || cleaned[key] === 'all') {
        cleaned[key] = null;
      }
    });
    return cleaned;
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updateUrlParams();
    this.loadCombinedProducts(this.route.snapshot.queryParams['gender']);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.updateUrlParams();
    this.loadCombinedProducts(this.route.snapshot.queryParams['gender']);
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.updateUrlParams();
    this.loadCombinedProducts(this.route.snapshot.queryParams['gender']);
  }

  onColorChange(): void {
    this.currentPage = 1;
    this.updateUrlParams();
    this.loadCombinedProducts(this.route.snapshot.queryParams['gender']);
  }

  selectColor(color: string) { // For filter
    this.selectedColor = color.toLowerCase();
    console.log('Selected Filter Color:', this.selectedColor);
    this.onColorChange();
  }

  pickColor(product: Product, color: string) { // For product card, renamed from selectColor
    product.selectedColor = color;
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.updateUrlParams();
    this.loadCombinedProducts(this.route.snapshot.queryParams['gender']);
  }

  toggleColorDropdown() {
    this.isColorDropdownOpen = !this.isColorDropdownOpen;
  }

  getSelectedColorLabel(): string {
    if (!this.selectedColor) return `All Colors (${this.DisplayingfullProductsNumber})`;
    const color = this.uniqueColors.find(c => c.name.toLowerCase() === this.selectedColor);
    return color ? `${color.name} (${color.count})` : `All Colors (${this.DisplayingfullProductsNumber})`;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
      this.updateUrlParams();
      this.loadCombinedProducts(this.route.snapshot.queryParams['gender']);
    }
  }

  activeLink(page: number): void {
    if (this.currentPage !== page) {
      this.goToPage(page);
    }
  }

  backBtn(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextBtn(): void {
    if (this.currentPage < this.totalPages.length) {
      this.goToPage(this.currentPage + 1);
    }
  }

  updateProductsPerPage(): void {
    this.currentPage = 1;
    this.updateUrlParams();
    this.loadCombinedProducts(this.route.snapshot.queryParams['gender']);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.isDropdownOpen = false;
    this.onCategoryChange();
  }

  getSelectedCategoryLabel(): string {
    if (!this.selectedCategory) return `All Categories (${this.DisplayingfullProductsNumber})`;
    const category = this.uniqueCategories.find(c => c.name === this.selectedCategory);
    return category ? `${category.name} (${category.count})` : `All Categories (${this.DisplayingfullProductsNumber})`;
  }

  private loadCombinedProducts(gender?: string): void {
    this.isLoading = true; // Start loading
    this.allProducts.forEach((product, index) => {
      setTimeout(() => {
        product.visible = false;
      }, index * 80);
    });

    const staggerDelay = 80;
    const transitionDuration = 500;
    const totalFadeOutTime = (this.allProducts.length * staggerDelay) + transitionDuration;

    setTimeout(() => {
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
          console.log('Response of the products within carousel:', response); // Debug log
          this.allProducts = response.products.map((product: Product) => ({
            ...product,
            image: product.image.map(img => `http://localhost:3000/images/${img}`),
            amount: 1,
            selectedColor: product.colors[0], // Default to first color, like ProductHome
            visible: false
          }));

          this.totalPages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
          this.currentPage = response.currentPage;
          this.uniqueCategories = response.categoriesWithCounts;
          this.DisplayingfullProductsNumber = this.uniqueCategories.reduce((total, category) => {
            return total + (category?.count || 0);
          }, 0);
          this.uniqueColors = response.colorsWithCounts;

          setTimeout(() => {
            this.allProducts.forEach((product, index) => {
              setTimeout(() => {
                product.visible = true;
              }, index * 150);
            });
            this.isLoading = false; // Stop loading after animation
          }, 300);
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.isLoading = false; // Stop loading on error
        }
      });
    }, totalFadeOutTime);
  }

  addToCart(product: Product) {
    const cartItem: CartItem = {
      amount: product.amount || 1,
      name: product.name,
      price: product.price,
      image: product.image[0],
      productID: product._id,
      color: product.selectedColor || product.colors[0] // Use selectedColor like ProductHome
    };

    this._CartService.addToCart(cartItem).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
      },
      error: (err) => {
        console.error('Error adding product to cart:', err);
      }
    });
  }

  // Added reset method
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedSort = 'newest';
    this.selectedColor = '';
    this.selectedCategory = '';
    this.currentPage = 1;
    this.updateUrlParams();
    this.loadCombinedProducts(this.route.snapshot.queryParams['gender']);
  }
}