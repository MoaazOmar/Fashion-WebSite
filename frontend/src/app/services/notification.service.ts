import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number; // Unique
  message: string;
  type: 'info' | 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

// Change the prepend logic to append instead:
showNotification(message: string, type: 'info' | 'success' | 'error' = 'info') {
  const newNotification: Notification = {
    id: Date.now(),
    message,
    type
  };

  // Append the new notification to the end
  const current = this.notificationsSubject.value;
  this.notificationsSubject.next([...current, newNotification]); // Changed to append

  setTimeout(() => {
    this.removeNotification(newNotification.id);
  }, 3000);
}

  removeNotification(id: number) {
    const updated = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(updated);
  }
}
