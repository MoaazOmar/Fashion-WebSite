import { Component, AfterViewInit } from '@angular/core';

declare const Swiper: any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit {
  isBannerActive: boolean = false;
  isMenuActive: boolean = false;
  isBodyActive:boolean = false
  ngAfterViewInit() {
    const swiperConfig = {
      direction: 'vertical',
      speed: 800,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      slidesPerView: 2,
      spaceBetween: 10,
      grabCursor: true,
      watchSlidesProgress: true,
      resistanceRatio: 0.7,
      effect: 'creative',
      creativeEffect: {
        prev: {
          translate: [0, '-20%', 0],
          opacity: 0.5
        },
        next: {
          translate: [0, '100%', 0]
        }
      }
    };

    new Swiper('.swiper-women', swiperConfig);

    new Swiper('.swiper-men', {
      ...swiperConfig,
      slidesPerView: 3,
      effect: 'slide',
      autoplay: {
        ...swiperConfig.autoplay,
        delay: 3000,
        reverseDirection: true
      }
    });

    new Swiper('.swiper-new', {
      ...swiperConfig,
      autoplay: {
        ...swiperConfig.autoplay,
        delay: 2500
      }
    });
  }

  toggleBanner() {
    this.isBannerActive = !this.isBannerActive;
    this.isBodyActive   = !this.isBodyActive
  }

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }
}