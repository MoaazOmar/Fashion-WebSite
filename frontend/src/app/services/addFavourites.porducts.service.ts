import { Injectable } from "@angular/core";
import { Product } from "../../interfaces/product.model";
import { BehaviorSubject, Observable } from "rxjs";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class AddFavoriteService {
  private favoriteKey = 'love';
  private loveSubject = new BehaviorSubject<number>(0);

  constructor(private notificationService: NotificationService) {
    const savedFavorites = this.getLove(); // Read favorites from localStorage
    this.loveSubject.next(savedFavorites.length); // Update the subject with the stored count
  }

  love$: Observable<number> = this.loveSubject.asObservable();

  private saveLove(products: Product[]): void {
    localStorage.setItem(this.favoriteKey, JSON.stringify(products));
    this.loveSubject.next(products.length); // Update the BehaviorSubject with correct length
  }
  


  getLove(): Product[] {
    const loveData = localStorage.getItem(this.favoriteKey);
    const products = loveData ? JSON.parse(loveData) : [];
    // this.loveSubject.next(products.length); // Use actual array length
    return products;
  }



  addLove(product: Product): Product[] {
    const products = this.getLove();
    const existingIndex = products.findIndex(p => p._id === product._id);

    if (existingIndex > -1) {
      products.splice(existingIndex, 1);
      // Trigger notification for removal
      this.notificationService.showNotification('Item removed from favorites', 'info');
    } else {
      products.push(product);
      // Trigger notification for addition
      this.notificationService.showNotification('Item added to favorites', 'success');
    }
    
    this.saveLove(products);
    return products;
  }



  removeLoveProduct(productId: string): void {
    const updatedLove = this.getLove().filter(item => item._id !== productId);
    this.saveLove(updatedLove);
      // Trigger notification for removal
      this.notificationService.showNotification('Item removed from favorites', 'info');
    }




  clearLove(): void {
    this.saveLove([]);
    this.notificationService.showNotification('All favorites cleared', 'info');
  }

}