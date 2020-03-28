import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountiesComponent } from './counties.component';
import { CountyDetailComponent } from './county/county-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { CountyDetailResolver } from './county/county-detail-resolver.service';


const routes: Routes = [  
  { 
    path: "",     
    pathMatch: "full",
    component: CountiesComponent
  },  
  { 
    path: ":countyId",
    component: CountyDetailComponent,    
    resolve: {      
      countyDetail: CountyDetailResolver
    }
  }  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { 
      scrollPositionRestoration: "enabled" 
    }), 
    HttpClientModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
