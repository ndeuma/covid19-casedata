import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { STATE_GERMANY_API, STATE_GERMANY_HOST } from "src/app/deployment";
import { CaseData } from "../../case-data.to";

@Injectable({
    providedIn: "root"
})
export class StateCaseService {

    constructor(private readonly http: HttpClient) { }

    public getStateCases(stateCode: string): Observable<CaseData[]> {
        // TODO: Convert response into CaseData
        return this.http.get<CaseData[]>(`${STATE_GERMANY_HOST}${STATE_GERMANY_API}/DE-${stateCode}/cases`);
    }

}