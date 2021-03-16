import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RestaurantListComponent } from './restaurants/restaurant-list/restaurant-list.component';


@NgModule({
  declarations: [
    AppComponent,
    RestaurantListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [RestaurantListComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
