import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ThemeService } from '../../services/theme.service';
import { Order } from '../../../interfaces/order.model';
@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isDarkMode: boolean = false;

  // Filters
  selectedStatus: string = '';
  selectedTime: string = '';
  searchQuery: string = '';

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private adminService: AdminService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  loadOrders(): void {
    this.adminService.getRecentOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        console.log('i will show you the full orders' ,orders)
        this.applyFilters();
      },
      error: (err) => console.error('Error fetching orders:', err)
    });
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    // Filter by status
    if (this.selectedStatus) {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }

    // Filter by time
    const now = new Date();
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.timestamp);
      switch (this.selectedTime) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          return orderDate >= monthAgo;
        case 'year':
          const yearAgo = new Date();
          yearAgo.setFullYear(now.getFullYear() - 1);
          return orderDate >= yearAgo;
        default:
          return true;
      }
    });

    // Search filter: by orderID, customerName, or address
    if (this.searchQuery) {
      const query = this.searchQuery.trim().toLowerCase();
      filtered = filtered.filter(order => {
        const idStr = order._id ? order._id.toString().toLowerCase() : '';
        const customerStr = order.customerName ? order.customerName.toLowerCase() : '';
        const addressStr = order.address ? order.address.toLowerCase() : '';
        return idStr.includes(query) || customerStr.includes(query) || addressStr.includes(query);
      });
    }
        
    // Set the full filtered list and update pagination
    this.filteredOrders = filtered;
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  // Getter for paginated orders
  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearch(): void {
    console.log('Search Query:', this.searchQuery);
    this.currentPage = 1;
    this.applyFilters();
  }
  
updateOrderStatus(order: Order, newStatus: string): void {
  this.adminService.updateOrderStatus(order._id!, newStatus).subscribe({
    next: (updatedOrder) => {
      order.status = updatedOrder.status;
      if (newStatus === 'Delivered') {
        this.updateProductStock(order);
        this.loadOrders(); // Reload orders to reflect changes
      }
      this.applyFilters();
      this.loadOrders(); // Reload orders to reflect changes
    },
    error: (err) => console.error('Error updating status:', err)
  });
}

updateProductStock(order: Order): void {
  order.items.forEach(item => {
    this.adminService.updateProductStock(item.productID, item.amount).subscribe({
      next: (response) => console.log(`Stock updated for ${item.productID}:`, response),
      error: (err) => console.error('Stock update failed:', err)
    });
  });
}
getPaginationRange(): number[] {
  const total = this.totalPages;
  const current = this.currentPage;
  const maxVisible = 7;

  const range: number[] = [];
  
  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) range.push(i);
    return range;
  }
  
  range.push(1);

  let left = current - 2;
  let right = current + 2;

  if (current <= 4) {
    left = 2;
    right = 5;
  } else if (current >= total - 3) {
    left = total - 4;
    right = total - 1;
  }
  
  if (left > 2) range.push(-1); // Use -1 instead of '...'
  
  for (let i = left; i <= right; i++) range.push(i);
  
  if (right < total - 1) range.push(-1); // Use -1 instead of '...'
  
  range.push(total);
  
  return range;
}

}
