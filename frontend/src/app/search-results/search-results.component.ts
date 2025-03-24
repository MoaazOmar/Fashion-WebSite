
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core'; // Add ChangeDetectorRef
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../interfaces/product.model';
import { SuggestionSearchService } from '../services/suggestion-search.service';
import { Set } from '../../interfaces/distinctAndCount.model';
import { gsap } from 'gsap';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  query: string = '';
  results: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalSearchProducts: number = 0;
  FilteringColors: Set[] = [];
  selectedColors: string[] = [];
  totalCategories: Set[] = [];
  selectedCategories: string[] = [];
  selectedSort: string = '';
  selectedGenders: string[] = [];
  productPerPageHolder: Array<number> = [5, 10, 20, 30];
  isFilterSidebarOpen: boolean = false;
  selectedProduct: Product | null = null;

  @ViewChild('listPanel') listPanel!: ElementRef;
  @ViewChild('detailPanel') detailPanel!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _suggestionSearchService: SuggestionSearchService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef // Add for manual change detection
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.query = params.get('query') || '';
      this.fetchSearchResults();
    });

    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;
      this.itemsPerPage = +params['limit'] || 3;
      this.selectedColors = params['color'] ? params['color'].split(',') : [];
      this.selectedCategories = params['category'] ? params['category'].split(',') : [];
      this.selectedGenders = params['gender'] ? params['gender'].split(',') : [];
      this.selectedSort = params['sort'] || '';
      this.fetchSearchResults();
    });
  }

  openFilterSidebar(): void {
    this.isFilterSidebarOpen = true;
  }

  closeFilterSidebar(): void {
    this.isFilterSidebarOpen = false;
  }

  private updateUrlParams(): void {
    const queryParams = {
      query: this.route.snapshot.queryParams['query'] || 'all',
      page: this.currentPage,
      limit: this.itemsPerPage,
      sort: this.selectedSort,
      color: this.selectedColors.length ? this.selectedColors.join(',') : null,
      category: this.selectedCategories.length ? this.selectedCategories.join(',') : null,
      gender: this.selectedGenders.length ? this.selectedGenders.join(',') : null
    };

    console.log('Updating URL params:', queryParams); // Debug
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.cleanParams(queryParams),
      queryParamsHandling: 'merge'
    });
  }

  private cleanParams(params: any): any {
    const cleaned = { ...params };
    Object.keys(cleaned).forEach((key) => {
      if (!cleaned[key] || cleaned[key] === 'all') {
        cleaned[key] = null;
      }
    });
    return cleaned;
  }

  setItemsPerPage(option: number): void {
    console.log('Setting itemsPerPage to:', option); // Debug
    this.itemsPerPage = option;
    this.onItemsPerPageChange();
  }

  onItemsPerPageChange(): void {
    console.log('Items per page changed, resetting page and fetching:', this.itemsPerPage); // Debug
    this.currentPage = 1;
    this.fetchSearchResults();
    this.updateUrlParams();
  }

  changeTheColor(colors: string[]): void {
    this.selectedColors = colors;
    this.onColorChange();
  }

  onColorChange(): void {
    this.currentPage = 1;
    this.fetchSearchResults();
    this.updateUrlParams();
  }

  changeTheCategory(categories: string[]): void {
    this.selectedCategories = categories;
    this.onCategoryChange();
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.fetchSearchResults();
    this.updateUrlParams();
  }

  changeTheSort(selectedSort: string): void {
    this.selectedSort = selectedSort;
    this.onSortChange();
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.fetchSearchResults();
    this.updateUrlParams();
  }

  changeTheGender(genders: string[]): void {
    this.selectedGenders = genders;
    this.onGenderChange();
  }

  onGenderChange(): void {
    this.currentPage = 1;
    this.fetchSearchResults();
    this.updateUrlParams();
  }

  fetchSearchResults(filters: any = {}, page: number = 1): void {
    this.currentPage = page;
    this.results = [];
    filters = {
      ...(this.selectedColors.length && { color: this.selectedColors }),
      ...(this.selectedCategories.length && { category: this.selectedCategories }),
      ...(this.selectedSort && { sort: this.selectedSort }),
      ...(this.selectedGenders.length && { gender: this.selectedGenders })
    };

    console.log('Fetching results with:', { filters, page, limit: this.itemsPerPage }); // Debug
    this._suggestionSearchService
      .getSuggestion(this.query, filters, page, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          console.log('Fetch response:', response); // Debug
          this.results = response.suggestions.map((product) => ({
            ...product,
            image: [`http://localhost:3000/images/${product.image}`]
          }));
          this.totalSearchProducts = response.totalCount;
          this.FilteringColors = response.colorsWithCounts;
          this.totalCategories = response.categoriesWithCounts;
          this.cdr.detectChanges(); // Force change detection
          // Animate product cards
          gsap.from('.product-card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.2 // Slight delay after fetch
          });
        },

        error: (err) => {
          console.error('Error fetching results:', err);
          this.results = [];
          this.cdr.detectChanges(); // Force change detection on error
        }
      });
  }

  changePage(newPage: number): void {
    const totalPages = Math.ceil(this.totalSearchProducts / this.itemsPerPage);
    if (newPage >= 1 && newPage <= totalPages) {
      this.fetchSearchResults({}, newPage);
    }
  }

  openDetail(product: Product): void {
    this.selectedProduct = product;
    gsap.to(this.detailPanel.nativeElement, {
      x: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
    gsap.to(this.listPanel.nativeElement, {
      width: '60%',
      duration: 0.5,
      ease: 'power2.out'
    });
  }

  closeDetail(): void {
    gsap.to(this.detailPanel.nativeElement, {
      x: '100%',
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        this.selectedProduct = null;
      }
    });
    gsap.to(this.listPanel.nativeElement, {
      width: '100%',
      duration: 0.5,
      ease: 'power2.out'
    });
  }
}