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
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';
import { AdminGuard } from './guards/admin.guard';
import { NonAdminGuard } from './guards/nonadmin--skip-tests.guard';
import { NotfoundComponent } from './notfound/notfound.component';
const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [NonAdminGuard] },
  { path: 'search-results/:query', component: SearchResultsComponent, canActivate: [NonAdminGuard] },
  { path: 'shopping', component: ShoppingComponent, canActivate: [NonAdminGuard] },
  { path: 'shopping-products', component: ProductsComponent, canActivate: [NonAdminGuard]},
  { path: 'login', component: LoginComponent, canActivate: [accessGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [accessGuard] },
  { path: 'cart', component: CartComponent, canActivate: [NonAdminGuard]},
  { path: 'checkout', component: CheckoutComponent, canActivate: [NonAdminGuard]},
  { path: 'orders', component: OrdersComponent, canActivate: [NonAdminGuard] },
  { path: 'success', component: SuccessComponent, canActivate: [NonAdminGuard] },
  { path: 'products/:id', component: ProductslistComponent, canActivate: [NonAdminGuard] },
  { path: 'about', component: AboutComponent, canActivate: [NonAdminGuard] },
  { path: 'love', component: FavouriteComponent, canActivate: [NonAdminGuard] },
  {
    path: 'admin',
    component: NavbarAdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'manage-products', component: ManageProductsComponent },
      { path: 'manage-orders', component: ManageOrdersComponent },
    ]
  },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}