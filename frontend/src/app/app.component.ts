import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavigationStart, NavigationCancel, NavigationError,  } from '@angular/router';
import {LoadingService} from './services/loading.service'
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAdminRoute = false;
  loading$: Observable<boolean>; // Declare without initializing

  constructor(
    private loadingService: LoadingService,
    private router: Router
  ) {
    // Now assign loading$ after loadingService is available
    this.loading$ = this.loadingService.loading$;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAdminRoute = event.url.startsWith('/admin');
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.hide();
      }
    });
  }
}