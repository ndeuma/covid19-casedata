import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CountyData } from './county-data.to';
import { CountyService } from './county.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: "root"
})
export class CountiesResolver implements Resolve<CountyData[]> {

    constructor(private readonly countyService: CountyService) {  }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CountyData[]> {
        return this.countyService.getCounties();
    }

}