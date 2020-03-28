import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CaseData } from './case-data.to';
import { Observable } from 'rxjs';
import { CaseService } from './case.service';

@Injectable({
    providedIn: "root"
})
export class CasesResolver implements Resolve<CaseData[]> {
    
    constructor(private readonly caseService: CaseService) { }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CaseData[]> {        
        return this.caseService.getRecentCaseData(route.params.countyId!);
    }
}