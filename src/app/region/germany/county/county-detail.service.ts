import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RegionData } from "../../region-data.to";
import { Observable } from "rxjs";

import { COUNTY_GERMANY_HOST, COUNTY_GERMANY_API } from "src/app/deployment";

@Injectable({
    providedIn: "root"
})
export class CountyDetailService {

    constructor(private readonly http: HttpClient) { }

    public getCountyDetail(countyId: string): Observable<RegionData> {
        return this.http.get<RegionData>(`${COUNTY_GERMANY_HOST}${COUNTY_GERMANY_API}/county/${countyId}/`);
    }

}
