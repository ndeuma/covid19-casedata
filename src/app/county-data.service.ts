import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CountyData } from './county-data.to';

@Injectable({
    providedIn: "root"
})
export class CountyDataService {

    private readonly HOST = "https://covid19-api-backend.herokuapp.com"

    private readonly API = "/api/v0.1"

    private readonly ENDPOINT = "/county/EM/"
    
    constructor(private readonly http: HttpClient) { }

    getCountyData(): Observable<CountyData> {
        return this.http.get(`${this.HOST}${this.API}${this.ENDPOINT}`) as Observable<CountyData>;       
    }
}