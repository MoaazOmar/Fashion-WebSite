import { AddFavoriteService } from './../services/addFavourites.porducts.service';
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {  Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isClicked: boolean = false;
  searchQuery: string = '';
  userRole: string = 'user';
  isAuthenticated: boolean = false;
  isUserMenuOpen: boolean = false;
  firstChar: string = '';
  userUsername: string = '';
  EmailOfTheUser: string = '';
  loveNumber: number = 0;
  isMenuOpen: boolean = false;

  private searchSubject = new Subject<string>();
  cartItemCount: number = 0;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    private _authService: AuthService,
    public _cartService: CartService,
    private AddFavoriteService:AddFavoriteService

  ) {}

  ngOnInit(): void {
    this.headerScrolled();
  
    // Auth subscription with cart handling
    this._authService.currentUser.subscribe((user) => {
      this.updateAuthStatus(user);
      if (user) {
        this._cartService.getCartItems().subscribe(); // Fetch cart on login
      } else {
        this._cartService.preserveCartItems([]) // Clear cart on logout
      }
    });
  
    // Subscribe to cart updates
    this._cartService.currentCartItems$.subscribe({
      next: (items) => {
        this.cartItemCount = items.length;
        console.log('Updated cartItemCount:', this.cartItemCount);
      },
      error: (err) => console.error('Error in cart subscription:', err)
    });
  
    // Handle clicks outside profile menu
    document.addEventListener('click', (event) => {
      const profileUser = document.querySelector('.profile-Icon');
      const profileDescription = document.querySelector('.profile-description');
      if (
        profileUser &&
        !profileUser.contains(event.target as Node) &&
        !profileDescription?.contains(event.target as Node)
      ) {
        profileUser.classList.remove('checkedProfile');
        this.isUserMenuOpen = false;
      }
    });
  
    this.AddFavoriteService. love$.subscribe(favorites => {
      this.loveNumber = favorites;
      console.log('Favorite count updated:', this.loveNumber);
    });
  }
  // Rest of your methods remain unchanged...
  updateAuthStatus(user: any): void {
    this.isAuthenticated = !!user;
    if (this.isAuthenticated) {
      this.userRole = user?.isAdmin ? 'admin' : 'user';
      this.firstChar = user?.username ? user.username.charAt(0).toUpperCase() : '?';
      this.userUsername = user?.username || 'Unknown';
      this.EmailOfTheUser = user?.email || 'N/A';
    } else {
      this.userRole = 'user';
      this.firstChar = '';
      this.userUsername = '';
      this.EmailOfTheUser = '';
    }
  }
  gettingTheIconRotation(event: Event) {
    event.stopPropagation();
    const profileUser = document.querySelector('.profile-Icon');
    if (profileUser) {
      profileUser.classList.toggle('checkedProfile');
      this.isUserMenuOpen = !this.isUserMenuOpen;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.headerScrolled();
  }

  becameClicked(_clickedElement: Event) {
    this.isClicked = !this.isClicked;
    this.searchQuery = '';
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.searchSubject.next(this.searchQuery);
  }

  goToSearchComponent() {
    this.router.navigate(['/search-results', this.searchQuery]);
    this.isClicked = false;
  }

  logout(): void {
    this._authService.logout();
    this.updateAuthStatus(null);
    this.isUserMenuOpen = false;
    this.router.navigate(['/login']);
  }

  headerScrolled() {
    const selectHeader = this.el.nativeElement.querySelector('#header');
    const backtoTop = this.el.nativeElement.querySelector('.back-to-top');
    if (selectHeader) {
      if (window.scrollY > 100) {
        this.renderer.addClass(selectHeader, 'header-scrolled');
        if (backtoTop) this.renderer.addClass(backtoTop, 'active');
      } else {
        this.renderer.removeClass(selectHeader, 'header-scrolled');
        if (backtoTop) this.renderer.removeClass(backtoTop, 'active');
      }
    }
  }

  // function fro responsive 
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
}

  closeMenu(): void {
    this.isMenuOpen = false;
  }

}