import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { of } from "rxjs";

import { HealthService } from "src/app/health/health.service";
import { RegionDetail, RegionType } from "../region-detail";
import { CaseData } from "../case-data.to";
import { BaseAwareHttpService } from "src/app/http/base-aware-http.service";

@Injectable({
    providedIn: "root",
})
export class GermanyDetailResolver implements Resolve<RegionDetail> {

    constructor(
        private readonly http: BaseAwareHttpService,
        private readonly healthService: HealthService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const regionData = of(
            {
                name: "Deutschland",
                ags: "DE",
                state: "Deutschland",
                bez: "Bundesrepublik",
                gen: "Deutschland",
                population: 83019213,
                population_density_km: 0,
                population_male: 0,
                population_female: 0,
            }
        );
        // Source: https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Situationsberichte/Gesamt.html
        // Cases and deaths numbers are from the situation report of the respective day and do not include
        // cases that are retroactively added in later days
        const caseData = this.http.get<CaseData[]>("data/germany.json");
        return this.healthService.generateRegionDetail(regionData, caseData, of([]), "country");
    }

}
