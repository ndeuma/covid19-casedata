import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
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
import { FatalityRateChartComponent } from './county/fatality-rate-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    CountiesComponent,
    CountyDetailComponent,
    HistoryChartComponent,
    FatalityRateChartComponent,
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
    {provide: LocationStrategy, useClass: HashLocationStrategy}  
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
