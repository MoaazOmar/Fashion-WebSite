import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ThemeService } from '../../services/theme.service'; 
@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {
  currentPage: string = 'Dashboard';
  isDarkMode: boolean = false;

  constructor(private router: Router, private themeService: ThemeService) {}

  ngOnInit() {
    // Subscribe to dark mode changes
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Update breadcrumb on route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBreadcrumb(event.urlAfterRedirects);
      }
    });
  }

  updateBreadcrumb(url: string) {
    switch (url) {
      case '/admin':
      case '/admin/':
        this.currentPage = 'Dashboard';
        break;
      case '/admin/add-product':
        this.currentPage = 'Add Product';
        break;
      case '/admin/manage-products':
        this.currentPage = 'Manage Products';
        break;
      case '/admin/manage-orders':
        this.currentPage = 'Manage Orders';
        break;
      default:
        this.currentPage = 'Dashboard';
    }
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}