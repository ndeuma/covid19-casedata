import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { STATE_GERMANY_API, STATE_GERMANY_HOST } from "src/app/deployment";
import { CaseData } from "../../case-data.to";
import { convertActionBinding } from "@angular/compiler/src/compiler_util/expression_converter";
import { map } from "rxjs/operators";
import * as moment from "moment";

@Injectable({
    providedIn: "root"
})
export class StateCaseService {

    constructor(private readonly http: HttpClient) { }

    public getStateCases(stateCode: string): Observable<CaseData[]> {
        return this.http.get<CaseData[]>(`${STATE_GERMANY_HOST}${STATE_GERMANY_API}/DE-${stateCode}/cases`).pipe(
            map((data) => this.convert(data))
        );
    }

    private convert(response: any): CaseData[] {
        return response.data
            .map((item) => { 
                const date = Object.keys(item)[0];
                const formattedDate = moment(date).format("YYYY-MM-DD");
                return {            
                    infected_total: item[date],
                    deaths_total: 0,
                    intensive_total: 0,
                    immune_total: 0,
                    date_day: formattedDate,
                    last_updated: date,
                }
            })
            .reverse();
    }

}