import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Product } from '../../../interfaces/product.model';
import { ShoppinglistService } from '../../services/shoppinglist.service';
import { ActivatedRoute } from '@angular/router';
declare const Swiper: any;

@Component({
  selector: 'app-summer-section',
  templateUrl: './summer-section.component.html',
  styleUrls: ['./summer-section.component.css']
})
export class SummerSectionComponent implements OnInit, AfterViewInit {
  @ViewChild('summerEffect') summerEffect!: ElementRef<HTMLCanvasElement>;
  @ViewChild('swiperRef') swiperRef!: ElementRef<HTMLDivElement>;

  isDarkTheme: boolean = false;

  // Mock summer collection data (replace with your service if needed)
  summerCollection:Product[] = [];

  constructor(private shoppingService: ShoppinglistService ,
              private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.checkDarkMode();
    this.route.queryParams.subscribe(param => {
      const gender = param['gender'];
      console.log('Frontend Gender Param:', gender);
      this.getSummerCollections(gender)
    });
  }

  ngAfterViewInit(): void {
    this.initSummerEffect();
    this.initSwiper();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    const summerSection = document.querySelector('app-summer-section') as HTMLElement;
    if (summerSection) {
      summerSection.classList.toggle('dark', this.isDarkTheme);
    }
  }

  checkDarkMode(): void {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkTheme = true;
      document.querySelector('app-summer-section')?.classList.add('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      this.isDarkTheme = event.matches;
      document.querySelector('app-summer-section')?.classList.toggle('dark', event.matches);
    });
  }
  getSummerCollections(gender: string){
    const params = { gender: gender || 'all' };
    this.shoppingService.getCombinedProducts(params).subscribe({
      next:(response)=>{
        this.summerCollection = response.summerCollection.map((product: Product)=>({
          ...product,
          image: product.image.map(img => `http://localhost:3000/images/${img}`),
        }))
      }
    })
  }
  initSwiper(): void {
    const swiperElement = this.swiperRef?.nativeElement;
    if (swiperElement) {
      new Swiper(swiperElement, {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        initialSlide: 2,
        speed: 900,
        loop: true,
        slideToClickedSlide: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 5,
          stretch: 0,
          depth: 200,
          modifier: 2.5,
          slideShadows: false,
        },
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          480: {
            slidesPerView: 'auto',
            spaceBetween: 30
          }
        },
        on: {
          init: function (this: any) {
            // Add initial animation
            (this.slides as HTMLElement[]).forEach((slide: HTMLElement) => {
              slide.style.transition = 'all 0.6s cubic-bezier(0.3, 0, 0.2, 1)';
            });
          },
          slideChange: function (this: any) {
            // Add animation to slide change
            const activeSlide = this.slides[this.activeIndex];
            if (activeSlide) {
              activeSlide.style.transition = 'all 0.6s cubic-bezier(0.3, 0, 0.2, 1)';
            }
          }
        },
      });
    }
  }
  toggleDetails(event: Event): void {
    event.stopPropagation();
    const slide = (event.target as HTMLElement).closest('.swiper-slide');
    const details = slide?.querySelector('.product-details') as HTMLElement | null;
    const btn = slide?.querySelector('.quick-view-btn') as HTMLElement | null;
    if (details && btn) {
      if (details.style.maxHeight === '150px') {
        details.style.maxHeight = '0';
        details.style.opacity = '0';
        btn.innerHTML = this.getZoomIcon();
      } else {
        details.style.maxHeight = '150px';
        details.style.opacity = '1';
        btn.innerHTML = this.getCloseIcon();
      }
    }
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    const btn = event.target as HTMLButtonElement;
    btn.style.backgroundColor = '#4cd137';
    btn.textContent = 'Added ✓';
    setTimeout(() => {
      btn.style.backgroundColor = '';
      btn.textContent = 'Add to Cart';
    }, 2000);
  }

  getZoomIcon(): string {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      <line x1="11" y1="8" x2="11" y2="14"></line>
      <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>`;
  }

  getCloseIcon(): string {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      <line x1="11" y1="8" x2="11" y2="14"></line>
    </svg>`;
  }

  initSummerEffect(): void {
    const canvas = this.summerEffect.nativeElement;
    const ctx = canvas.getContext('2d')!;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    class SunParticle {
      x!: number;
      y!: number;
      size!: number;
      baseOpacity!: number;
      opacity!: number;
      color!: number[];
      speedX!: number;
      speedY!: number;
      pulseSpeed!: number;
      pulseDirection!: number;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.baseOpacity = Math.random() * 0.5 + 0.2;
        this.opacity = this.baseOpacity;
        this.color = [255, Math.floor(Math.random() * 100) + 155, Math.floor(Math.random() * 50)];
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.pulseSpeed = Math.random() * 0.01 + 0.005;
        this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.pulseSpeed * this.pulseDirection;
        if (this.opacity <= 0.1 || this.opacity >= this.baseOpacity + 0.2) {
          this.pulseDirection *= -1;
        }
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
        ctx.fill();
      }
    }

    class SunRay {
      x!: number;
      y!: number;
      length!: number;
      width!: number;
      angle!: number;
      opacity!: number;
      fadeSpeed!: number;
      rotateSpeed!: number;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = width / 2 + (Math.random() * 400 - 200);
        this.y = height / 2 + (Math.random() * 400 - 200);
        this.length = Math.random() * 150 + 50;
        this.width = Math.random() * 4 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.fadeSpeed = Math.random() * 0.01 + 0.005;
        this.rotateSpeed = (Math.random() * 0.001 + 0.0005) * (Math.random() > 0.5 ? 1 : -1);
      }

      update() {
        this.angle += this.rotateSpeed;
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0) {
          this.reset();
        }
      }

      draw() {
        const startX = this.x;
        const startY = this.y;
        const endX = this.x + Math.cos(this.angle) * this.length;
        const endY = this.y + Math.sin(this.angle) * this.length;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(255, 200, 50, ${this.opacity})`;
        ctx.lineWidth = this.width;
        ctx.stroke();
      }
    }

    const PARTICLE_COUNT = 150;
    const RAY_COUNT = 15;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => new SunParticle());
    const rays = Array.from({ length: RAY_COUNT }, () => new SunRay());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      rays.forEach(ray => {
        ray.update();
        ray.draw();
      });
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });

    animate();
  }
}