import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { RegionDetail, RegionType } from '../../region-detail';

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
        const countyId = route.params.countyId!;
        const county_data = this.countyDetailService.getCountyDetail(countyId);
        const case_data = this.countyCaseService.getCountyCases(countyId);
        const demographic_data = this.countyDemographicService.getDemographics(countyId);
        return this.healthService.generateRegionDetail(county_data, case_data, demographic_data, "county");
    }
}