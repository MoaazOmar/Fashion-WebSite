import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { SingleProductService } from '../../services/single-product.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Product } from '../../../interfaces/product.model';
import { AuthService } from '../../services/auth.service';
import { AddFavoriteService } from '../../services/addFavourites.porducts.service'; // Updated import
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-you-may-also-like',
  templateUrl: './you-may-also-like.component.html',
  styleUrls: ['./you-may-also-like.component.css']
})
export class YouMayAlsoLikeComponent implements AfterViewInit, OnInit {
  @ViewChild('sliderContainer') sliderContainer!: ElementRef;
  @ViewChild('sliderWrapper') sliderWrapper!: ElementRef;
  productId: string = '';
  products: Product[] = [];
  currentIndex = 0;
  isFavorite: boolean = false;
  slidesPerView = window.innerWidth <= 768 ? 2 : 3;

  constructor(
    private _singleProductServices: SingleProductService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private addFavoriteService: AddFavoriteService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.loadProduct(); 
      this._singleProductServices.getRelatedProducts(this.productId).subscribe({
        next: (response) => {
          console.log('Related products response:', response);
          this.products = response.relatedProducts.map((product: Product) => ({
            ...product,
            image: `http://localhost:3000/images/${product.image}`,
            isFavorite: this.addFavoriteService.getLove().some(fav => fav._id === product._id), // Fixed line
            showMenu: false
          }));
          this.cdr.detectChanges();
          setTimeout(() => {
            this.updateSlider();
          });
        },
        error: (err) => console.error(err)
      });
    });
    this.addFavoriteService.love$.subscribe(() => {
      const loveProducts = this.addFavoriteService.getLove();
      this.products = this.products.map(product => ({
        ...product,
        isFavorite: loveProducts.some(fav => fav._id === product._id)
      }));
    });
}

loadProduct(): void {
  this._singleProductServices.getProduct(this.productId).subscribe({
    next: (response) => {
      console.log('Main product loaded:', response);
      // Update any properties if necessary
    },
    
    error: (err) => console.error(err)
  });
  this.cdr.detectChanges();

}

  ngAfterViewInit() {
    this.updateSlider();
  }

  @HostListener('window:resize')
  onResize() {
    this.slidesPerView = window.innerWidth <= 768 ? 2 : 3;
    this.updateSlider();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-trigger') && !target.closest('.product-menu')) {
      this.products.forEach(product => product.showMenu = false);
    }
  }

  updateSlider() {
    const slideElement = this.sliderContainer.nativeElement.querySelector('.slider-slide');
    if (!slideElement) return;
    const slideWidth = slideElement.offsetWidth + 20;
    const translateX = this.currentIndex * slideWidth * this.slidesPerView;
    this.sliderWrapper.nativeElement.style.transform = `translateX(-${translateX}px)`;
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider();
    }
  }

  nextSlide() {
    if (this.currentIndex < this.totalPages - 1) {
      this.currentIndex++;
      this.updateSlider();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.slidesPerView);
  }

  goToPage(page: number) {
    this.currentIndex = page;
    if (this.currentIndex >= this.totalPages) {
      this.currentIndex = this.totalPages - 1;
    }
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
    this.updateSlider();
  }

  // Updated toggleFavorite that calls the service
  toggleFavorite(product: Product) {
    this.addFavoriteService.addLove(product);
    product.isFavorite = !product.isFavorite;

  }
  
  toggleMenu(product: any) {
    product.showMenu = !product.showMenu;
  }

  viewProduct(product: any) {
    this.router.navigate(['/products', product._id]);
    product.showMenu = false;
    console.log('Product object:', product);
    console.log('View:', product.name);
    
  }

  addToCart(product: any) {
    console.log('Add to cart:', product.name);
    product.showMenu = false;
  }

  shareProduct(product: any) {
    console.log('Share:', product.name);
    product.showMenu = false;
  }
}