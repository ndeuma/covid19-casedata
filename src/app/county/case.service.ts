import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HOST, API } from '../deployment';
import { CaseData } from './case-data.to';


@Injectable({
    providedIn: "root"
})
export class CaseService {
    
    constructor(private readonly http: HttpClient) { }

    getRecentCaseData(countyId: string): Observable<CaseData[]> {
        return this.http.get<CaseData[]>(`${HOST}${API}/county/${countyId}/cases/`);        
    }

    getLatestCaseData(countyId: string): Observable<CaseData> {
        return this.http.get<CaseData>(`${HOST}${API}/county/${countyId}/cases/latest/`);        
    }
}