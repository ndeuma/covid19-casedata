import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { RegionDetail } from './region-detail';

@Component({    
    selector: 'casedata-region-detail',
    templateUrl: './region-detail.component.html'
})
export class RegionDetailComponent {    

    regionDetail$: Observable<RegionDetail>;

    constructor(route: ActivatedRoute) {
      this.regionDetail$ = route.data.pipe(map(data => data.regionDetail));      
    }
}