import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications$!: Observable<Notification[]>;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notifications$ = this.notificationService.notifications$;
  }

  // Returns the heart animation class based on the notification type.
  getMouthStyle(type: string): string {
    // If it's "error" OR "info", show a sad mouth. Otherwise, happy.
    return (type === 'error' || type === 'info') ? 'sad' : 'happy';
  }
    
  getHeartAnimation(type: string): string {
    if (type === 'success') {
      return 'jump';
    } else if (type === 'error' || type === 'info') {
      return 'sad-wiggle';
    } else {
      return 'beat';
    }
  }
  }  