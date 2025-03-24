import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NavbarAdminComponent } from './admin/navbar-admin/navbar-admin.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component'; // Add this
import { ProductsComponent } from './shopping/products/products.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ShoppingComponent } from './shopping/shopping.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
import { SuccessComponent } from './success/success.component';
import { ProductslistComponent } from './productslist/productslist.component';
import { FavouriteComponent } from './favourite/favourite.component';
import { AboutComponent } from './about/about.component';
import { accessGuard } from './guards/access.guard';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { ManageProductsComponent } from './admin/manage-products/manage-products.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'search-results/:query', component: SearchResultsComponent },
  { path: 'shopping', component: ShoppingComponent },
  { path: 'shopping-products', component: ProductsComponent },
  { path: 'login', component: LoginComponent, canActivate: [accessGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [accessGuard] },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'products/:id', component: ProductslistComponent },
  { path: 'about', component: AboutComponent },
  { path: 'love', component: FavouriteComponent },
  {
    path: 'admin',
    component: NavbarAdminComponent, // Navbar as a layout component
    children: [
      { path: '', component: AdminDashboardComponent }, // Default admin route
      // Add more admin routes here, e.g.:
      { path: 'add-product', component: AddProductComponent },
      { path: 'manage-products', component: ManageProductsComponent },
      // { path: 'manage-orders', component: ManageOrdersComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}