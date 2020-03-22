import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CountyData } from './county-data.to';

@Injectable({
    providedIn: "root"
})
export class CountyDataService {
    
    constructor() { }

    getCountyData(): Observable<CountyData> {
        return of({
            name: "Emmendingen",
            slug: "EM",
            ags: 35667,
            state: "Baden-Württemberg",
            alternative_name: "",
            description: "",
            population: 165383,
            population_density: 243
        });
    }
}