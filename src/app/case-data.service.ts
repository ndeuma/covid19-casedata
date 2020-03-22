import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CaseData } from './case-data.to';


@Injectable({
    providedIn: "root"
})
export class CaseDataService {
    
    constructor() { }

    getCaseData(): Observable<CaseData> {
        return of({
            infected_total: 100,
            deaths_total: 4,
            intensive_total: 11,
            immune_total: 19,
            date_day: "2020-03-22",
            last_updated: "2020-03-22T15:35:48.497Z"
        });
    }
}