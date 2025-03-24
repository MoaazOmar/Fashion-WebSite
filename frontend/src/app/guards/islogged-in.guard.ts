import { CanActivateFn  , Router} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const isloggedInGuard: CanActivateFn = (route, state) => {
  // Guard can't have it's constructor so we use inject method
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.currentUserValue){
     // User is not logged in - redirect to login
    router.navigate(['/login']);
    return false;
  }
  else
  // User is logged in so he can access logout 
    return true;

};
