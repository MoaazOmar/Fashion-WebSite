import { CartService } from './../../services/cart.service';
import { Set } from './../../../interfaces/distinctAndCount.model';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../interfaces/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppinglistService } from '../../services/shoppinglist.service';
import { trigger, state, style, transition, animate } from '@angular/animations'
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
  productsPerPage = 4;
  searchTerm = '';
  selectedSort = 'newest';
  selectedColor = '';
  colors: string[] = [];
  uniqueCategories: Set[] = [];
  selectedCategory: string = '';
  DisplayingfullProductsNumber: number = 0;
  uniqueColors: Set[] = [];
  isDropdownOpen: boolean = false;
  isColorDropdownOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ShoppinglistService,
    private _CartService:CartService
  ) { }

  ngOnInit(): void {
    // Subscribe to URL query parameters for dynamic filtering, sorting, and pagination
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 1;
      this.productsPerPage = +params['limit'] || 4;
      this.selectedSort = params['sort'] || 'newest';
      this.searchTerm = params['search'] || '';
      this.selectedColor = params['color'] || '';
      this.selectedCategory = params['category'] || '';
      this.loadCombinedProducts(params['gender']);
    });
    
    // Close dropdown when clicking outside
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

  selectColor(color: string) {
    this.selectedColor = color.toLowerCase();
    console.log('Selected Color:', this.selectedColor);
    this.onColorChange();
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
  // pagination method

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
      this.updateUrlParams();
      this.loadCombinedProducts(this.route.snapshot.queryParams['gender']);
    }
  }
  activeLink(page: number): void {
    if (this.currentPage !== page) {
      this.goToPage(page); // reusing your existing page change logic
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
  // displaying number of products per page option 
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

  // Load products and set the initial 'visible' state to false. Then, animate visibility.
  private loadCombinedProducts(gender?: string): void {
    // Stagger the fade-out of existing products
    this.allProducts.forEach((product, index) => {
      setTimeout(() => {
        product.visible = false; // Trigger fade-out for each product with delay
      }, index * 80); // 80ms stagger between each product's fade-out
    });
  
    // Calculate total fade-out duration (stagger + transition time)
    const staggerDelay = 80;
    const transitionDuration = 500; // Should match CSS transition duration
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
          this.allProducts = response.products.map((product: Product) => ({
            ...product,
            image: `http://localhost:3000/images/${product.image}`,
            visible: false // Start invisible
          }));
  
          this.totalPages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
          this.currentPage = response.currentPage;
          this.uniqueCategories = response.categoriesWithCounts;
          this.DisplayingfullProductsNumber = this.uniqueCategories.reduce((total, category) => {
            return total + (category?.count || 0);
          }, 0);
          this.uniqueColors = response.colorsWithCounts;
  
          // Staggered fade-in with increased delay
          setTimeout(() => {
            this.allProducts.forEach((product, index) => {
              setTimeout(() => {
                product.visible = true; // Trigger fade-in with delay
              }, index * 150); // 150ms stagger between appearances
            });
          }, 300); // Initial delay before starting fade-in
        },
        error: (err) => console.error('Error loading products:', err)
      });
    }, totalFadeOutTime); // Wait for all fade-outs to complete
  }
    addToCart(product: Product) {
      const cartItem: CartItem = {
        amount: product.amount || 1, 
        name: product.name,
        price: product.price,
        image: product.image[0],
        productID: product._id 
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
    
  

}