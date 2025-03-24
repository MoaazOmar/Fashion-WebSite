// import { Component, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';
// import { CarouselService } from '../../services/carousel.service';
// import { Product } from './../../../interfaces/product.model';
// import { ProductsShoppingService } from '../../services/products-shopping.service';

// @Component({
//   selector: 'app-banner',
//   templateUrl: './banner.component.html',
//   styleUrls: ['./banner.component.css']
// })
// export class BannerComponent implements OnInit {
//   products: Product[] = [];
//   currentPage = 1;
//   @ViewChild('banner', { static: true }) banner!: ElementRef;
//   @ViewChild('resetBtn', { static: true }) resetBtn!: ElementRef;

//   constructor(
//     private renderer: Renderer2,
//     private carouselService: CarouselService,
//     private productsService: ProductsShoppingService
//   ) {}

//   ngOnInit(): void {
//     this.loadCarouselProducts('Female'); // Default to Female products on init
//   }

//   loadCarouselProducts(gender: string): void {
//     this.carouselService.getCarouselProducts(gender).subscribe(
//       (products) => {
//         this.products = products.map(product => ({
//           ...product,
//           image: `http://localhost:3000/images/${product.image}`
//         }));
//       },
//       (error) => {
//         console.error('Error fetching products:', error);
//       }
//     );
//   }

//   switchBanner(name: string): void {
//     this.toggleBannerClass(name);
//     this.renderer.addClass(this.resetBtn.nativeElement, 'rotate');

//     // Load products based on the selected banner
//     const gender = name === 'left' ? 'Female' : name === 'middle' ? 'Male' : 'Special';
//     this.loadCarouselProducts(gender);
//   }

//   resetBanner(): void {
//     this.renderer.setAttribute(this.banner.nativeElement, 'class', 'banner');
//     this.renderer.removeClass(this.resetBtn.nativeElement, 'rotate');
//     this.checkResetButton();
//   }

//   toggleBannerClass(className: string): void {
//     if (!this.banner.nativeElement.classList.contains(className)) {
//       this.renderer.setAttribute(this.banner.nativeElement, 'class', 'banner');
//       this.renderer.addClass(this.banner.nativeElement, className);
//     }
//     this.checkResetButton();
//   }

//   checkResetButton(): void {
//     if (this.banner.nativeElement.className === 'banner') {
//       this.renderer.setAttribute(this.resetBtn.nativeElement, 'disabled', 'true');
//     } else {
//       this.renderer.removeAttribute(this.resetBtn.nativeElement, 'disabled');
//     }
//   }
// }










import { Component, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';
import { Product } from './../../../interfaces/product.model';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  products: Product[] = [];
  carouselProducts: Product[] = [];
  currentPage = 1;

  @ViewChild('banner', { static: true }) banner!: ElementRef;
  @ViewChild('resetBtn', { static: true }) resetBtn!: ElementRef;

  constructor(
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadProducts('Female'); // Default to Female products on init
  }

  loadProducts(gender: string): void {
    
  }

  switchBanner(name: string): void {
    this.toggleBannerClass(name);
    this.renderer.addClass(this.resetBtn.nativeElement, 'rotate');

    // Load products based on the selected banner
    const gender = name === 'left' ? 'Female' : name === 'middle' ? 'Male' : 'Special';
    this.loadProducts(gender);
  }

  resetBanner(): void {
    this.renderer.setAttribute(this.banner.nativeElement, 'class', 'banner');
    this.renderer.removeClass(this.resetBtn.nativeElement, 'rotate');
    this.checkResetButton();
  }

  toggleBannerClass(className: string): void {
    if (!this.banner.nativeElement.classList.contains(className)) {
      this.renderer.setAttribute(this.banner.nativeElement, 'class', 'banner');
      this.renderer.addClass(this.banner.nativeElement, className);
    }
    this.checkResetButton();
  }

  checkResetButton(): void {
    if (this.banner.nativeElement.className === 'banner') {
      this.renderer.setAttribute(this.resetBtn.nativeElement, 'disabled', 'true');
    } else {
      this.renderer.removeAttribute(this.resetBtn.nativeElement, 'disabled');
    }
  }
}