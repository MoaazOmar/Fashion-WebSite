import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, SignupRequest, AuthResponse } from '../../interfaces/auth.model';
import {AddFavoriteService} from './addFavourites.porducts.service'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Base URL for auth endpoints
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router , private _addFavoriteService:AddFavoriteService) {
    // Initialize the currentUserSubject with the user from localStorage (if available)
    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    console.log('Initial user from localStorage:', this.currentUserSubject.value); // Add this
    this.currentUser = this.currentUserSubject.asObservable();
  }



  // // Get the current user value
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // localstorge to store user 
  private setUser(user: User): void {
    console.log('Setting user:', user); // Add this
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  
  //  // signup
  signup(signupRequest:SignupRequest):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup` , signupRequest ,{ withCredentials: true }).pipe(
      tap((response:AuthResponse)=>{
        if(response.user){
          this.setUser(response.user)
        }
      })
    )
  }
   //  // login if the user is existed and successfuly login tap will do that it will store the user details in the browser
login(loginRequest: LoginRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest, { withCredentials: true }).pipe(
    tap((response: any) => {
      console.log('Login response:', response);
      // Adjust this filter based on the expected property in a valid user object
      const user = Array.isArray(response)
        ? response.find((item: any) => item.username || item.email)
        : response.user;
      console.log('this is user after logged in', user);
      if (user) {
        this.setUser(user);
      }
    })
    
    
  );
}

  // // Logout
  logout(): void {
  // // Remove user from localStorage and set currentUserSubject to null
    localStorage.removeItem('currentUser');
    this._addFavoriteService.clearLove();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']); // Redirect to login page
  }

}