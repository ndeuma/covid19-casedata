import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { CountiesComponent } from './counties.component';
import { CountyDetailComponent } from './county/county-detail.component';
import { CountyService } from './county/county.service';
import { CountyDetailResolver } from './county/county-detail-resolver.service';
import { HistoryChartComponent } from './county/history-chart.component';
import { AgeDistributionChartComponent } from './county/age-distribution-chart.component';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

@NgModule({
  declarations: [
    AppComponent,
    CountiesComponent,
    CountyDetailComponent,
    HistoryChartComponent,
    AgeDistributionChartComponent
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
export class AppModule {
  constructor() {
    registerLocaleData(localeDe, 'de');
  }  
}
