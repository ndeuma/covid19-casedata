import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { RegionsComponent } from './regions.component';
import { RegionDetailComponent } from './region/region-detail.component';
import { CountyDetailResolver } from './region/germany/county/county-detail-resolver.service';
import { HistoryChartComponent } from './region/history-chart.component';
import { AgeDistributionChartComponent } from './region/age-distribution-chart.component';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { FatalityRateChartComponent } from './region/fatality-rate-chart.component';
import { HealthService } from "./health/health.service";
import { CountyCaseService } from "./region/germany/county/county-case.service";
import { CountyDetailService } from "./region/germany/county/county-detail.service";
import { CountyDemographicService } from "./region/germany/county/county-demographic.service";
import { StateDetailService } from "./region/germany/state/state-detail.service";
import { StateCaseService } from "./region/germany/state/state-case.service";
import { StateDetailResolver } from "./region/germany/state/state-detail-resolver.service";

@NgModule({
  declarations: [
    AppComponent,
    RegionsComponent,
    RegionDetailComponent,
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
    HealthService,
    // German counties
    CountyDetailService,
    CountyCaseService,
    CountyDemographicService,    
    CountyDetailResolver,  
    // German states
    StateDetailService,
    StateCaseService,
    StateDetailResolver,
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
