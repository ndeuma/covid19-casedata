import { CaseData } from "../../case-data.to";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { COUNTY_GERMANY_HOST, COUNTY_GERMANY_API } from "src/app/deployment";
import { BaseAwareHttpService } from "src/app/http/base-aware-http.service";

@Injectable({
    providedIn: "root"
})
export class CountyCaseService {

    constructor(private readonly http: BaseAwareHttpService) { }

    public getCountyCases(countyId: string): Observable<CaseData[]> {
        return this.http.get<CaseData[]>(`data/${countyId}.json`);
    }

}
