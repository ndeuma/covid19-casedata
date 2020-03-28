import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { CountiesComponent } from './counties.component';
import { CountyDetailComponent } from './county/county-detail.component';
import { CountyService } from './county.service';
import { AppComponent } from './app.component';
import { CaseService } from './county/case.service';
import { CasesResolver } from './county/cases-resolver.service';
import { DemographicService } from './county/demographic.service';
import { DemographicResolver } from './county/demographic-resolver.service';
import { CountyResolver } from './county/county-resolver.service';

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
    CaseService,
    DemographicService,
    CountyResolver,
    CasesResolver,
    DemographicResolver,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
