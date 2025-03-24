import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const accessGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('Guard executing. Current user:', authService.currentUserValue); // Add this

  if (authService.currentUserValue) {
    console.log('Redirecting logged-in user from', state.url);

    // Logged in: Redirect to home and block access
    router.navigate(['/']);
    return false;
  }
  // Not logged in: Allow access
  return true;
};