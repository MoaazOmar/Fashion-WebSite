// login.component.ts
import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriteProductsService } from '../services/favorite-products.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private _AuthService: AuthService,
    private _router: Router,
    private favoriteProductsService: FavoriteProductsService
  ) {}

  credentials = {
    username: '',
    password: ''
  };
  passwordFieldType: string = 'password';
  showPassword = false;
  errorMessage: string = '';
  shakeForm: boolean = false;

  loginUser() {
    this.errorMessage = '';
    this.shakeForm = false;

    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Please fill in all fields';
      this.triggerShake();
      return;
    }

    this._AuthService.login(this.credentials).subscribe({
      next: (response) => {
        if (response.user?.isAdmin) {
          this._router.navigate(['/admin']);
        } else {
          this.favoriteProductsService.mergeGuestFavorites(response.user.username);
          this._router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.triggerShake();
      }
    });
  }

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    this.showPassword = !this.showPassword;
  }

  private triggerShake() {
    this.shakeForm = true;
    setTimeout(() => {
      this.shakeForm = false;
    }, 500); // Duration matches the shake animation
  }
}