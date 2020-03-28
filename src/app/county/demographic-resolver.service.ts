import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DemographicService } from './demographic.service';
import { Observable } from 'rxjs';
import { CaseData } from './case-data.to';
import { Demographic } from './demographic.to';

@Injectable({
    providedIn: "root"
})
export class DemographicResolver implements Resolve<Demographic[]> {
    
    constructor(private readonly demographicService: DemographicService) { }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Demographic[]> {        
        return this.demographicService.getDemographicsForLatestDate(route.params.countyId!);
    }
}