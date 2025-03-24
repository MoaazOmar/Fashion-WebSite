import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppinglistService } from '../../services/shoppinglist.service';

@Component({
  selector: 'app-browse-categories',
  templateUrl: './browse-categories.component.html',
  styleUrls: ['./browse-categories.component.css']
})
export class BrowseCategoriesComponent implements OnInit  {
  @ViewChild('sliderContainer') sliderContainer!: ElementRef;
  @ViewChild('sliderWrapper') sliderWrapper!: ElementRef;

  currentIndex = 0;
  slidesPerView = window.innerWidth <= 768 ? 2 : 4;

  categories = [
    { name: 'Dresses', gender: 'Women', productCount: 0, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae' },
    { name: 'Tops', gender: 'Women', productCount: 0, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c' },
    { name: 'Shirts', gender: 'Men', productCount: 0, image: 'https://cdn.pixabay.com/photo/2023/05/23/08/49/fashion-8012239_1280.jpg' },
    { name: 'Accessories', gender: 'Special', productCount: 0, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a' },
    { name: 'Footwear', gender: 'Special', productCount: 0, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2' },
    { name: 'Hijab', gender: 'Special', productCount: 0, image: 'https://cdn.pixabay.com/photo/2017/08/07/16/48/black-2605605_1280.jpg' },
    { name: 'Glasses', gender: 'Special', productCount: 0, image: 'https://cdn.pixabay.com/photo/2014/11/09/20/06/woman-524141_1280.jpg' },
    { name: 'Jackets', gender: 'Women', productCount: 0, image: 'https://images.unsplash.com/photo-1519235624215-85175d5eb36e' }
  ];

  constructor(private router: Router, private _shoppinglistService: ShoppinglistService) {}

  ngOnInit(): void {
    this.fetchCategoryCounts();
  }

  fetchCategoryCounts(): void {
    this._shoppinglistService.getCombinedProducts({}).subscribe({
      next: (response: any) => {
        const categoriesWithCounts = response.categoriesWithCounts || [];
        this.categories.forEach(category => {
          const matchedCategory = categoriesWithCounts.find(
            (c: any) => c.name.toLowerCase() === category.name.toLowerCase()
          );
          if (matchedCategory) {
            category.productCount = matchedCategory.count;
          }
        });
        setTimeout(() => this.updateSlider());
      },
      error: (err) => console.error('Error fetching category counts:', err)
    });
  }

  // Updated routing to match your desired URL: /shopping?gender=women&category=Tops
  navigateToShoppingList(category: { name: string; gender: string }) {
    this.router.navigate(['/shopping'], {
      queryParams: {
        gender: category.gender.toLowerCase(), // Convert to lowercase for consistency
        category: category.name
      }
    });
  }

  get totalPages(): number {
    return Math.max(this.categories.length - this.slidesPerView + 1, 0);
  }

  @HostListener('window:resize')
  onResize() {
    this.slidesPerView = window.innerWidth <= 768 ? 2 : 4;
    this.currentIndex = Math.min(this.currentIndex, this.totalPages - 1);
    this.updateSlider();
  }

  updateSlider() {
    const slideWidth = this.sliderContainer.nativeElement.querySelector('.slider-slide').offsetWidth + 20;
    const translateX = this.currentIndex * slideWidth;
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

  goToPage(page: number) {
    this.currentIndex = Math.min(page, this.totalPages - 1);
    this.currentIndex = Math.max(this.currentIndex, 0);
    this.updateSlider();
  }

}