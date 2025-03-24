import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriteProductsService } from '../services/favorite-products.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private _AuthService: AuthService, private _router: Router , 
    private favoriteProductsService:FavoriteProductsService
  ) {}

  credentials = {
    username: '',
    password: ''
  };
  passwordFieldType: string = 'password';
  showPassword = false;
  errorMessage: string = ''; // Add this


  loginUser() {
    this.errorMessage = ''; // Reset error message
    
    // Basic validation
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this._AuthService.login(this.credentials).subscribe({
      next: (response) => {
        // Check if the user is an admin
        if (response.user?.isAdmin) {
          this._router.navigate(['/admin']); // Adjust this route to match your admin navbar route
        } else {
          this.favoriteProductsService.mergeGuestFavorites(response.user.username);
          this._router.navigate(['/']); // Regular users go to home
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    this.showPassword = !this.showPassword;
  }

}




