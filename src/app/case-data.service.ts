import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CaseData } from './case-data.to';


@Injectable({
    providedIn: "root"
})
export class CaseDataService {
    
    private readonly HOST = "https://covid19-api-backend.herokuapp.com"

    private readonly API = "/api/v0.1"

    private readonly ENDPOINT = "/county/EM/cases/"

    constructor(private readonly http: HttpClient) { }

    getCaseData(): Observable<CaseData> {
        return this.http.get(`${this.HOST}${this.API}${this.ENDPOINT}`) as Observable<CaseData>;        
    }
}