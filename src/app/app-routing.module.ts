import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountiesComponent } from './counties.component';
import { CountyDetailComponent } from './county/county-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { CountiesResolver } from './counties-resolver.service';


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
    path: ":ags",
    component: CountyDetailComponent,    
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true }), HttpClientModule],
  exports: [RouterModule],
})
export class AppRoutingModule { }
