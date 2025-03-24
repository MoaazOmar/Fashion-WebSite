import { Injectable } from '@angular/core';
import { getGuestFavorites, addGuestFavorite, removeGuestFavorite } from './guest-favorites.helper';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteProductsService {
  // BehaviorSubject to emit the latest favorites list
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  // Observable for components to subscribe to
  favorites$ = this.favoritesSubject.asObservable();

  constructor() { }

  // Generate a unique key based on the username for logged in users
  private storageKey(username: string): string {
    return `favorites_${username}`;
  }

  // Retrieve favorites: if username provided, return user's favorites; otherwise, return guest favorites.
  getFavorites(username?: string): string[] {
    let favorites: string[];
    if (username) {
      favorites = JSON.parse(localStorage.getItem(this.storageKey(username)) || '[]');
    } else {
      favorites = getGuestFavorites();
    }
    // Emit the current favorites list
    this.favoritesSubject.next(favorites);
    return favorites;
  }

  // Save favorites for a logged-in user and notify subscribers.
  private setFavorites(username: string, favorites: string[]): void {
    localStorage.setItem(this.storageKey(username), JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
    console.log('Emitted favorites:', favorites);
  }
  
  // Add a product to favorites: uses user favorites if username provided; otherwise, guest favorites.
  addFavorite(productId: string, username?: string): void {
    if (username) {
      const favorites = this.getFavorites(username);
      if (!favorites.includes(productId)) {
        favorites.push(productId);
        this.setFavorites(username, favorites);
      }
    } else {
      addGuestFavorite(productId);
      this.favoritesSubject.next(getGuestFavorites());
    }
  }

  // Remove a product from favorites: uses user favorites if username provided; otherwise, guest favorites.
  removeFavorite(productId: string, username?: string): void {
    if (username) {
      let favorites = this.getFavorites(username);
      favorites = favorites.filter(id => id !== productId);
      this.setFavorites(username, favorites);
    } else {
      removeGuestFavorite(productId);
      this.favoritesSubject.next(getGuestFavorites());
    }
  }

  // Toggle favorite status: add if not exists, remove if exists.
  // Returns true if favorited after toggling, false otherwise.
  toggleFavorite(productId: string, username?: string): boolean {
    if (username) {
      const favorites = this.getFavorites(username);
      if (favorites.includes(productId)) {
        this.removeFavorite(productId, username);
        return false;
      } else {
        this.addFavorite(productId, username);
        return true;
      }
    } else {
      const guestFavorites = getGuestFavorites();
      if (guestFavorites.includes(productId)) {
        removeGuestFavorite(productId);
        this.favoritesSubject.next(getGuestFavorites());
        return false;
      } else {
        addGuestFavorite(productId);
        this.favoritesSubject.next(getGuestFavorites());
        return true;
      }
    }
  }

  // Merge guest favorites with the logged-in user's favorites.
  // After merging, the guest favorites are cleared.
// In FavoriteProductsService
mergeGuestFavorites(username: string): void {
  const guestFavorites = getGuestFavorites();
  if (guestFavorites.length > 0) {
    let userFavorites = this.getFavorites(username);
    const mergedFavorites = [...new Set([...userFavorites, ...guestFavorites])];
    this.setFavorites(username, mergedFavorites);
    // Clear guest favorites
    localStorage.removeItem('guest_favorites');
    this.favoritesSubject.next(mergedFavorites);
  }
}
}