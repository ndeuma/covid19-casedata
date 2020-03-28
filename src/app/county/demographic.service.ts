import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { HOST, API } from '../deployment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Demographic } from './demographic.to';

@Injectable({
    providedIn: "root"
})
export class DemographicService {
    
    constructor(private readonly http: HttpClient) { }

    getDemographics(countyId: string): Observable<Demographic[]> {
        return this.http.get<Demographic[]>(`${HOST}${API}/county/${countyId}/gender_age/`);        
    }

    getDemographicsForLatestDate(countyId: string): Observable<Demographic[]> {
        return this.getDemographics(countyId).pipe(map(demographics => this.filterByLatestDate(demographics)));
    }
    
    private filterByLatestDate(demographics: Demographic[]): any {
        let latest = "";
        demographics.forEach((demographic) => {
            if (demographic.date_day.localeCompare(latest) > 0) {
                latest = demographic.date_day;
            }
        });
        return demographics.filter(demographic => demographic.date_day === latest);
    }
}