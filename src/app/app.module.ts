import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { CountiesComponent } from './counties.component';
import { CountyDetailComponent } from './county/county-detail.component';
import { CountyService } from './county.service';
import { AppComponent } from './app.component';
import { CountiesResolver } from './counties-resolver.service';

@NgModule({
  declarations: [
    AppComponent,
    CountiesComponent,
    CountyDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    CountiesResolver,
    CountyService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
