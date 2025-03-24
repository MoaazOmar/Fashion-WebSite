import { Component, OnInit } from '@angular/core';
import { NotificationCartService, Notification } from '../services/notification-cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification-cart',
  templateUrl: './notification-cart.component.html',
  styleUrls: ['./notification-cart.component.css']
})
export class NotificationCartComponent implements OnInit {
  notifications$: Observable<Notification[]>;

  constructor(private service: NotificationCartService) {
    this.notifications$ = this.service.NotificationCart$;
    console.log('🔔 Notification component initialized'); 
  }

  ngOnInit() {
    // Add debug logging
    this.notifications$.subscribe(notifications => {
      console.log('🔔 Current notifications in component:', notifications);
    });
  }
}