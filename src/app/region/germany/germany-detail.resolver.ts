import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { of } from "rxjs";

import { HealthService } from "src/app/health/health.service";
import { RegionDetail, RegionType } from "../region-detail";

@Injectable({
    providedIn: "root",
})
export class GermanyDetailResolver implements Resolve<RegionDetail> {

    constructor(
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
        const caseData = of ([
            { infected_total: 99225, deaths_total: 1607, date_day: "2020-04-07" },
            { infected_total: 95391, deaths_total: 1434, date_day: "2020-04-06" },
            { infected_total: 91714, deaths_total: 1342, date_day: "2020-04-05" },
            { infected_total: 85778, deaths_total: 1158, date_day: "2020-04-04" },
            { infected_total: 79696, deaths_total: 1017, date_day: "2020-04-03" },
            { infected_total: 73522, deaths_total: 872, date_day: "2020-04-02" },
            { infected_total: 67366, deaths_total: 732, date_day: "2020-04-01" },
            { infected_total: 61913, deaths_total: 583, date_day: "2020-03-31" },
            { infected_total: 57298, deaths_total: 455, date_day: "2020-03-30" },
            { infected_total: 52547, deaths_total: 389, date_day: "2020-03-29" },
            { infected_total: 48582, deaths_total: 325, date_day: "2020-03-28" },
            { infected_total: 42288, deaths_total: 253, date_day: "2020-03-27" },
            { infected_total: 36508, deaths_total: 198, date_day: "2020-03-26" },
            { infected_total: 31554, deaths_total: 149, date_day: "2020-03-25" },
            { infected_total: 27436, deaths_total: 114, date_day: "2020-03-24" },
            { infected_total: 22672, deaths_total: 86, date_day: "2020-03-23" },
            { infected_total: 18610, deaths_total: 55, date_day: "2020-03-22" },
            { infected_total: 16662, deaths_total: 47, date_day: "2020-03-21" },
            { infected_total: 13957, deaths_total: 31, date_day: "2020-03-20" },
            { infected_total: 10999, deaths_total: 20, date_day: "2020-03-19" },
            { infected_total: 8198, deaths_total: 12, date_day: "2020-03-18" },
            { infected_total: 7156, deaths_total: 12, date_day: "2020-03-17" },
            { infected_total: 6012, deaths_total: 13, date_day: "2020-03-16" },
            { infected_total: 4838, deaths_total: 12, date_day: "2020-03-15" },
            { infected_total: 3795, deaths_total: 8, date_day: "2020-03-14" },
            { infected_total: 3062, deaths_total: 5, date_day: "2020-03-13" },
            { infected_total: 2369, deaths_total: 5, date_day: "2020-03-12" },
            { infected_total: 1567, deaths_total: 3, date_day: "2020-03-11" },
            { infected_total: 1296, deaths_total: 2, date_day: "2020-03-10" },
            { infected_total: 1139, deaths_total: 2, date_day: "2020-03-09" },
            { infected_total: 902, deaths_total: 0, date_day: "2020-03-08" },
            { infected_total: 795, deaths_total: 0, date_day: "2020-03-07" },
            { infected_total: 639, deaths_total: 0, date_day: "2020-03-06" },
            { infected_total: 400, deaths_total: 0, date_day: "2020-03-05" },
            { infected_total: 262, deaths_total: 0, date_day: "2020-03-04" }
        ]);
        return this.healthService.generateRegionDetail(regionData, caseData, of([]), "country");
    }

}
