import { Component, OnInit, OnDestroy } from '@angular/core';
import { CountyData } from './county/county-data.to';
import { CountyService } from './county/county.service';
import { Observable, partition } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, groupBy } from 'rxjs/operators';

@Component({    
    selector: 'casedata-counties',
    templateUrl: './counties.component.html',    
})
export class CountiesComponent { }