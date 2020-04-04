import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { of } from "rxjs";

import { StateDetailService } from "./state-detail.service";
import { StateCaseService } from "./state-case.service";
import { HealthService } from "src/app/health/health.service";
import { RegionType } from "../../region-detail";

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
        const stateCode = route.params.stateCode;
        const stateData = this.stateDetailService.getStateDetail(stateCode);
        const caseData = this.stateCaseService.getStateCases(stateCode);
        return this.healthService.generateRegionDetail(stateData, caseData, of([]), "state");
    }

}
