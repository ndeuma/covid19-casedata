import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CountyData } from '../county-data.to';
import { Observable } from 'rxjs';
import { CountyService } from '../county.service';

@Injectable({
    providedIn: "root"    
})
export class CountyResolver implements Resolve<CountyData> {
    
    constructor(private readonly countyService: CountyService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CountyData> {
        return this.countyService.getCounty(route.params.countyId!);
    }
}