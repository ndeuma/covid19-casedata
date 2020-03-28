import { Component, OnDestroy } from '@angular/core';
import { CaseService } from './case.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';
import { CountyData } from '../county-data.to';
import { CaseData } from './case-data.to';
import { Demographic } from './demographic.to';

@Component({    
    selector: 'casedata-county-detail',
    templateUrl: './county-detail.component.html',
    styleUrls: ['./county-detail.component.scss']    
})
export class CountyDetailComponent implements OnDestroy {    

    private subscription: Subscription;

    county: CountyData;

    latest: CaseData;

    new_case_count: number = 0;

    male_percentage: number = 0;

    female_percentage: number = 0;
  
    latest_date: string;

    constructor(caseService: CaseService, route: ActivatedRoute, router: Router) {
      this.subscription = route.data.subscribe(data => {
        this.county = data.county;
        this.latest = data.cases[0];
        this.new_case_count = data.cases[0].infected_total - data.cases[1].infected_total;
        this.latest_date = data.cases[0].date_day; 
        
        this.computePercentageByGender(data.demographics);        
      });
    }

    private computePercentageByGender(demographics: Demographic[]): void {
      let infected_male = 0, infected_female = 0, infected_total = 0;      
      demographics.forEach((demographic) => {      
        infected_total += demographic.infected_total;
        if (demographic.gender === "m") {
          infected_male += demographic.infected_total;
        }
        if (demographic.gender === "w") {
          infected_female += demographic.infected_total;
        }        
      });
      this.male_percentage = Math.round((infected_male / infected_total) * 100);
      this.female_percentage = Math.round((infected_female / infected_total) * 100);
    }

    ngOnDestroy(): void {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
}