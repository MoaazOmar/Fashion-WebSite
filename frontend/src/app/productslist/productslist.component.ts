import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SingleProductService } from '../services/single-product.service';
import { Product } from '../../interfaces/product.model';
import { AuthService } from '../services/auth.service';
import { AddFavoriteService } from '../services/addFavourites.porducts.service';
import { CartService } from '../services/cart.service'; // Added CartService import

@Component({
  selector: 'app-productslist',
  templateUrl: './productslist.component.html',
  styleUrls: ['./productslist.component.css']
})
export class ProductslistComponent implements OnInit {
  product!: Product;
  productId!: string;
  productLiked: boolean = false;
  productDisliked: boolean = false;
  productLikeCount: number = 0;
  productDislikeCount: number = 0;
  activeTabGroupTwo: string = 'detailsCare';
  activeTabGroupOne: string = 'description';
  commentsCount: number = 0;
  quantity: number = 1;
  isFavorite: boolean = false;
  isLoggedIn: boolean = false;
  currentUserId: string | null = null;

  @ViewChild('carouselContainer') carouselContainer!: ElementRef;
  activeDotIndex: number = 0;
  activeTab: string = 'description';

  constructor(
    private route: ActivatedRoute,
    private _productServices: SingleProductService,
    private authService: AuthService,
    private addFavoriteService: AddFavoriteService,
    private cartService: CartService, // Added CartService
    private cdr: ChangeDetectorRef 
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.currentUserValue;
    
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.loadProduct();
    });
    
    this.authService.currentUser.subscribe(user => {
      this.currentUserId = user?.id || null;
      console.log('Set currentUserId:', this.currentUserId);
    });
  
    this.addFavoriteService.love$.subscribe(() => {
      const favorites = this.addFavoriteService.getLove();
      if (this.product) {
        this.isFavorite = favorites.some(fav => fav._id === this.product._id);
        console.log('after set current user', this.isFavorite);
      }
    });
  }
  
  loadProduct(): void {
    this._productServices.getProduct(this.productId).subscribe({
      next: (response) => {
        this.product = {
          ...response.product,
          image: response.product.image.map((img: string) => `http://localhost:3000/images/${img}`),
          selectedColor: response.product.colors?.[0] || '' // Set default color
        };
        this.productLikeCount = this.product.likes;
        this.productDislikeCount = this.product.dislikes;
        this.commentsCount = this.product.comments.length;
        if (!this.product.comments) {
          this.product.comments = [];
        }
        if (this.currentUserId) {
          this.productLiked = this.product.likedBy.includes(this.currentUserId);
          this.productDisliked = this.product.dislikedBy.includes(this.currentUserId);
        }
        this.isFavorite = this.addFavoriteService.getLove().some(fav => fav._id === this.product._id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error:', err)
    });
  }
  
  increment(): void {
    this.quantity++;
  }

  decrement(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  toggleFavorite(product: Product): void {
    const username = this.authService.currentUserValue?.username || 'guest';
    this.addFavoriteService.addLove(product);
    this.isFavorite = this.addFavoriteService.getLove().some(fav => fav._id === product._id);
    console.log(`${product.name} favorite status toggled. Now favorited? ${this.isFavorite}`);
  }

  onDotClick(index: number): void {
    const container = this.carouselContainer.nativeElement;
    const slideWidth = container.offsetWidth;
    container.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth'
    });
    this.activeDotIndex = index;
  }
  
  onProductLikeDblClick(): void {
    this._productServices.toggleLikeProduct(this.product._id).subscribe({
      next: (response) => {
        console.log('Current User ID:', this.currentUserId);
        console.log('Response likedBy:', response.likedBy);
        this.productLiked = response.likedBy.includes(this.currentUserId);
        this.productDisliked = response.dislikedBy.includes(this.currentUserId);
        this.productLikeCount = response.likes;
        this.productDislikeCount = response.dislikes;
        console.log(this.productLiked, this.productDisliked, this.productLikeCount, this.productDislikeCount);
      },
      error: (error) => console.error("Error toggling like:", error)
    });
  }

  onProductDislikeDblClick(): void {
    this._productServices.toggleDislikeProduct(this.product._id).subscribe({
      next: (response) => {
        if (this.currentUserId) {
          this.productDisliked = response.dislikedBy.includes(this.currentUserId);
          this.productLiked = response.likedBy.includes(this.currentUserId);
        }
        this.productLikeCount = response.likes;
        this.productDislikeCount = response.dislikes;
        console.log('Current User ID:', this.currentUserId);
        console.log(this.productLiked, this.productDisliked, this.productLikeCount, this.productDislikeCount);
      },
      error: (error) => console.error("Error toggling dislike:", error)
    });
  }

  // Added method to handle color selection
  selectColor(color: string): void {
    this.product.selectedColor = color;
    console.log('Selected color:', this.product.selectedColor);
  }

  // Added method to add product to cart
  addToCart(): void {
    if (!this.product.stock) {
      console.log('Cannot add to cart: Out of stock');
      return;
    }

    const cartItem = {
      productID: this.product._id,
      name: this.product.name,
      price: this.product.price,
      amount: this.quantity,
      image: this.product.image[0],
      color: this.product.selectedColor || this.product.colors[0],
      userID: this.currentUserId || undefined
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: () => console.log('Product added to cart'),
      error: (err) => console.error('Error adding to cart:', err)
    });
  }

  getAverageRating(): number {
    const ratedComments = this.product.comments.filter(comment => comment.rating !== null);
    if (ratedComments.length === 0) return 0;
    const totalRating = ratedComments.reduce((sum, comment) => sum + (comment.rating || 0), 0);
    return totalRating / ratedComments.length;
  }

  getTotalRatedComments(): number {
    return this.product.comments.filter(comment => comment.rating !== null).length;
  }

  getStarCount(star: number): number {
    return this.product.comments.filter(comment => comment.rating === star).length;
  }

  getStarPercentage(star: number): number {
    const totalRated = this.getTotalRatedComments();
    if (totalRated === 0) return 0;
    const count = this.getStarCount(star);
    return (count / totalRated) * 100;
  }

  getStarClass(i: number): string {
    const average = this.getAverageRating();
    if (i <= average) {
      return 'fas fa-star text-yellow-400';
    } else if (i - 0.5 <= average) {
      return 'fas fa-star-half-alt text-yellow-400';
    } else {
      return 'far fa-star text-yellow-400';
    }
  }

  openReviewForm(): void {
    console.log('Open review form');
  }
}