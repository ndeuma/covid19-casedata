import { Component } from '@angular/core';
import { CaseService } from './case.service';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';
import { CountyData } from '../county-data.to';
import { CaseData } from './case-data.to';

@Component({    
    selector: 'casedata-county-detail',
    templateUrl: './county-detail.component.html',
    styleUrls: ['./county-detail.component.scss']    
})
export class CountyDetailComponent {
    title = "COVID-19 Falldaten";

    latest$: Observable<CaseData>;

    county: CountyData;
  
    constructor(caseService: CaseService, route: ActivatedRoute, router: Router) {
      this.county = router.getCurrentNavigation().extras.state as CountyData;
      this.latest$ = route.paramMap.pipe(
        map((params) => params.get("ags")),
        switchMap(ags => caseService.getLatestCaseData(ags))
      )      
    }
}