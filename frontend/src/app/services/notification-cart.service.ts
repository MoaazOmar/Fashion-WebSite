import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number; // Unique
  message: string;
  type: 'info' | 'success' | 'error' | 'updated' | 'delete' | 'cart';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationCartService {
  private notificationCartSubject = new BehaviorSubject<Notification[]>([]);
  NotificationCart$ = this.notificationCartSubject.asObservable();

  constructor() { }

 // notification-cart.service.ts
showNotification(message: string, type: Notification['type'] = 'success') {
  const newNotification: Notification = {
    id: Date.now(),
    message,
    type
  };

  console.log('🏷️ Adding notification:', newNotification); // Add this
  console.log('📜 Current notifications:', this.notificationCartSubject.value); // Add this

  const current = this.notificationCartSubject.value;
  this.notificationCartSubject.next([...current, newNotification]);

  setTimeout(() => {
    console.log('⏳ Removing notification:', newNotification.id); // Add this
    this.removeNotification(newNotification.id);
  }, 3000);
}

  removeNotification(id: number) {
    const updated = this.notificationCartSubject.value.filter(n => n.id !== id);
    this.notificationCartSubject.next(updated);
  }
}
