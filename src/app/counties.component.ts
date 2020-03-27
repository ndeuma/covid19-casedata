import { Component, OnInit, OnDestroy } from '@angular/core';
import { CountyData } from './county-data.to';
import { CountyService } from './county.service';
import { Observable, partition } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, groupBy } from 'rxjs/operators';

@Component({    
    selector: 'casedata-counties',
    templateUrl: './counties.component.html',
    styleUrls: ['./counties.component.scss']    
})
export class CountiesComponent {
    
    counties$: Observable<CountyData[]>;

    constructor(route: ActivatedRoute) {        
        this.counties$ = route.data.pipe(
            map(data => data.counties),
            map(counties => counties.sort((c1: CountyData, c2: CountyData) => 
                c1.gen.localeCompare(c2.gen))
            )
        );
    }
}