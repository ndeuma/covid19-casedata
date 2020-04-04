import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { RegionDetail, RegionType } from "../../region-detail";

import { CountyDetailService } from "./county-detail.service";
import { CountyCaseService } from "./county-case.service";
import { CountyDemographicService } from "./county-demographic.service";
import { HealthService } from "src/app/health/health.service";

@Injectable({
    providedIn: "root"
})
export class CountyDetailResolver implements Resolve<RegionDetail> {

    constructor(
        private readonly countyDetailService: CountyDetailService,
        private readonly countyCaseService: CountyCaseService,
        private readonly countyDemographicService: CountyDemographicService,
        private readonly healthService: HealthService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RegionDetail> {
        const countyId = route.params.countyId;
        const countyData = this.countyDetailService.getCountyDetail(countyId);
        const caseData = this.countyCaseService.getCountyCases(countyId);
        const demographicData = this.countyDemographicService.getDemographics(countyId);
        return this.healthService.generateRegionDetail(countyData, caseData, demographicData, "county");
    }
}
