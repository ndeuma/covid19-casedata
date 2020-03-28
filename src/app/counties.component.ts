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
export class CountiesComponent { }