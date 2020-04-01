import { CaseData } from '../../case-data.to';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegionData } from '../../region-data.to';
import { COUNTY_GERMANY_HOST, COUNTY_GERMANY_API } from 'src/app/deployment';

@Injectable({
    providedIn: "root"
})
export class CountyCaseService {

    constructor(private readonly http: HttpClient) { }

    public getCountyCases(countyId: string): Observable<CaseData[]> {
        return this.http.get<CaseData[]>(`${COUNTY_GERMANY_HOST}${COUNTY_GERMANY_API}/county/${countyId}/cases/`);
    }

}