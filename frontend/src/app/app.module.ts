import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { BannerComponent } from './home/banner/banner.component';
import { CallupSectionComponent } from './home/callup-section/callup-section.component';
import { AboutSectionComponent } from './home/about-section/about-section.component';
import { ProductHomeComponent } from './home/product-home/product-home.component';
import { SignupletterComponent } from './home/signupletter/signupletter.component';
import { ContactComponent } from './home/contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Updated import
import { FormsModule } from '@angular/forms';
import { SearchinputComponent } from './header/searchinput/searchinput.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ShoppingComponent } from './shopping/shopping.component';
import { ProductsComponent } from './shopping/products/products.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
import { LogoutComponent } from './logout/logout.component';
import { CommonModule } from '@angular/common';
import { ProductslistComponent } from './productslist/productslist.component';
import { FormOrderComponent } from './form-order/form-order.component';
import { SuccessComponent } from './success/success.component';
import { ProductsCarouselComponent } from './shopping/products-carousel/products-carousel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TheaterComponent } from './shopping/theater/theater.component';
import { DropdownColorComponent } from './search-results/dropdown-color2/dropdown-color.component';
import { DropdownCategoryComponent } from './search-results/dropdown-category/dropdown-category.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommentSectionComponent } from './productslist/comment-section/comment-section.component';
import { ReplySectionComponent } from './productslist/reply-section/reply-section.component';
import { CommentComponent } from './productslist/comment/comment.component';
import { YouMayAlsoLikeComponent } from './productslist/you-may-also-like/you-may-also-like.component';
import { BrowseCategoriesComponent } from './productslist/browse-categories/browse-categories.component';
import { FavouriteComponent } from './favourite/favourite.component';
import { NotificationComponent } from './notification/notification.component';
import { AboutComponent } from './about/about.component';
import { NotificationCartComponent } from './notification-cart/notification-cart.component';
import { StarMethodComponent } from './productslist/star-method/star-method.component';
import { SortDropdownComponent } from './search-results/sort-dropdown/sort-dropdown.component';
import { FilterSidebarComponent } from './search-results/filter-sidebar/filter-sidebar.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { NavbarAdminComponent } from './admin/navbar-admin/navbar-admin.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { ManageProductsComponent } from './admin/manage-products/manage-products.component';
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';
import { BeautifyOrderIdPipe } from './pipes/beautify-order-id.pipe';
import { WinterSectionComponent } from './shopping/winter-section/winter-section.component';
import { SummerSectionComponent } from './shopping/summer-section/summer-section.component';
import { LoadingComponent } from './loading/loading.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { LoadingService } from './services/loading.service';
import { SliderFashionComponent } from './shopping/slider-fashion/slider-fashion.component';
import { NotfoundComponent } from './notfound/notfound.component'; 
const config: SocketIoConfig = { 
  url: 'http://localhost:3000', 
  options: { 
    withCredentials: true 
  } 
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    BannerComponent,
    CallupSectionComponent,
    AboutSectionComponent,
    ProductHomeComponent,
    SignupletterComponent,
    ContactComponent,
    FooterComponent,
    SearchinputComponent,
    SearchResultsComponent,
    ShoppingComponent,
    ProductsComponent,
    LoginComponent,
    SignupComponent,
    CheckoutComponent,
    OrdersComponent,
    LogoutComponent,
    CartComponent,
    ProductslistComponent,
    FormOrderComponent,
    SuccessComponent,
    ProductsCarouselComponent,
    TheaterComponent,
    DropdownCategoryComponent,
    DropdownColorComponent,
    TruncatePipe,
    CommentSectionComponent,
    ReplySectionComponent,
    CommentComponent,
    YouMayAlsoLikeComponent,
    BrowseCategoriesComponent,
    FavouriteComponent,
    NotificationComponent,
    AboutComponent,
    NotificationCartComponent,
    StarMethodComponent,
    SortDropdownComponent,
    FilterSidebarComponent,
    AdminDashboardComponent,
    NavbarAdminComponent,
    AddProductComponent,
    ManageProductsComponent,
    ManageOrdersComponent,
    BeautifyOrderIdPipe,
    WinterSectionComponent,
    SummerSectionComponent,
    LoadingComponent,
    SliderFashionComponent,
    NotfoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    provideAnimationsAsync(),
    LoadingService, // Add LoadingService to providers
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    } // Add LoadingInterceptor to HTTP_INTERCEPTORS
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }