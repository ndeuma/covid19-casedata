import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DemographicData } from "../../demographic-data.to";
import { COUNTY_GERMANY_HOST, COUNTY_GERMANY_API } from "src/app/deployment";

@Injectable({
    providedIn: "root"
})
export class CountyDemographicService {

    constructor(private readonly http: HttpClient) { }

    public getDemographics(countyId: string): Observable<DemographicData[]> {
        return this.http.get<DemographicData[]>(`${COUNTY_GERMANY_HOST}${COUNTY_GERMANY_API}/county/${countyId}/gender_age/latest/`);
    }

}
