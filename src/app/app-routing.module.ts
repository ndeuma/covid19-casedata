import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegionsComponent } from './regions.component';
import { RegionDetailComponent } from './region/region-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { CountyDetailResolver } from './region/germany/county/county-detail-resolver.service';
import { StateDetailResolver } from './region/germany/state/state-detail-resolver.service';
import { GermanyDetailResolver } from "./region/germany/germany-detail.resolver";


const routes: Routes = [  
  { 
    path: "",     
    pathMatch: "full",
    component: RegionsComponent
  },  
  {
    path: "germany",
    children: [{
        path: "all",
        component: RegionDetailComponent,    
        resolve: {      
          regionDetail: GermanyDetailResolver,
        },
      }, {
        path: "state/:stateCode",
        component: RegionDetailComponent,    
        resolve: {      
          regionDetail: StateDetailResolver,
        },
      }, {
        path: "county/:countyId",        
        component: RegionDetailComponent,    
        resolve: {      
          regionDetail: CountyDetailResolver
        }        
     }]
  }, { 
    path: ":countyId",
    redirectTo: "/germany/county/:countyId"
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
