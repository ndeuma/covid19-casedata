import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { of } from "rxjs";

import { StateDetailService } from "./state-detail.service";
import { StateCaseService } from "./state-case.service";
import { HealthService } from "src/app/health/health.service";

@Injectable({
    providedIn: "root",    
})
export class StateDetailResolver implements Resolve<any> {

    constructor(
        private readonly stateDetailService: StateDetailService,
        private readonly stateCaseService: StateCaseService,
        private readonly healthService: HealthService,
    ) { }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const stateCode = route.params.stateCode!;
        const county_data = this.stateDetailService.getStateDetail(stateCode);
        const case_data = this.stateCaseService.getStateCases(stateCode);        
        return this.healthService.generateRegionDetail(county_data, case_data, of([]));
    }
    
}