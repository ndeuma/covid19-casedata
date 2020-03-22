import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CaseDataService } from './case-data.service';
import { CountyDataService } from './county-data.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    CaseDataService,
    CountyDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
