import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { CountiesComponent } from './counties.component';
import { CountyDetailComponent } from './county/county-detail.component';
import { CountyService } from './county/county.service';
import { CountyDetailResolver } from './county/county-detail-resolver.service';
import { AppComponent } from './app.component';

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
    CountyService,    
    CountyDetailResolver,    
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
