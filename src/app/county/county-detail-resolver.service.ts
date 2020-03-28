import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CountyService } from './county.service';
import { CountyDetail } from './county-detail';

@Injectable({
    providedIn: "root"    
})
export class CountyDetailResolver implements Resolve<CountyDetail> {
    
    constructor(private readonly countyService: CountyService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CountyDetail> {
        return this.countyService.getCountyDetail(route.params.countyId!);
    }
}