import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountiesComponent } from './counties.component';
import { CountyDetailComponent } from './county/county-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { CountiesResolver } from './counties-resolver.service';
import { CasesResolver } from './county/cases-resolver.service';
import { DemographicResolver } from './county/demographic-resolver.service';
import { CountyResolver } from './county/county-resolver.service';


const routes: Routes = [  
  { 
    path: "",     
    pathMatch: "full",
    component: CountiesComponent,        
    resolve: {
      counties: CountiesResolver
    }
  },  
  { 
    path: ":countyId",
    component: CountyDetailComponent,    
    resolve: {
      cases: CasesResolver,
      demographics: DemographicResolver,
      county: CountyResolver
    }
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  exports: [RouterModule],
})
export class AppRoutingModule { }
