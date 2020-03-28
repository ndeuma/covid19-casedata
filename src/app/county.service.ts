import { Injectable } from '@angular/core';
import { HOST, API } from './deployment';
import { HttpClient } from '@angular/common/http';
import { CountyData } from './county-data.to';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class CountyService {

    constructor(private readonly http: HttpClient) { }

    getCounties(): Observable<CountyData[]> {
        return this.http.get<CountyData[]>(`${HOST}${API}/county/`);       
    }

    getCounty(countyId: string): Observable<CountyData> {
        return this.http.get<CountyData>(`${HOST}${API}/county/${countyId}/`);         
    }
}