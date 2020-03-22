import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CaseData } from './case-data.to';
import { CountyData } from './county-data.to';
import { CaseDataService } from './case-data.service';
import { CountyDataService } from './county-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = "COVID-19 Falldaten";

  caseData$: Observable<CaseData>;

  countyData$: Observable<CountyData>;

  constructor(caseDataService: CaseDataService, countyDataService: CountyDataService) {
    this.caseData$ = caseDataService.getCaseData();
    this.countyData$ = countyDataService.getCountyData();
  }
}
