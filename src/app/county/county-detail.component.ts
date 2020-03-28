import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CountyDetail } from './county-detail';

@Component({    
    selector: 'casedata-county-detail',
    templateUrl: './county-detail.component.html'
})
export class CountyDetailComponent {    

    countyDetail$: Observable<CountyDetail>;

    constructor(route: ActivatedRoute) {
      this.countyDetail$ = route.data.pipe(map(data => data.countyDetail));      
    }
}