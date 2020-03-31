import { Injectable } from '@angular/core';
import { HOST, API } from '../deployment';
import { HttpClient } from '@angular/common/http';
import { CountyData } from './county-data.to';
import { CaseData } from './case-data.to';
import { DemographicData } from './demographic-data.to';
import { Observable, combineLatest, fromEvent } from 'rxjs';
import { CountyDetail, AgeGroup, CaseHistory, Assessment } from './county-detail';
import { map, count } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import * as moment from 'moment';

@Injectable({
    providedIn: "root"
})
export class CountyService {

    constructor(private readonly http: HttpClient) { }

    private readonly PREDEFINED_AGE_GROUPS = ["0-4", "5-14", "15-34", "35-59", "60-79", "80+"];

    // Estimated recovery time in days
    private readonly RECOVERY_TIME = 21;

    getCounties(): Observable<CountyData[]> {
        return this.http.get<CountyData[]>(`${HOST}${API}/county/`);       
    }

    getCounty(countyId: string): Observable<CountyData> {
        return this.http.get<CountyData>(`${HOST}${API}/county/${countyId}/`);         
    }

    getCountyDetail(countyId: string): Observable<CountyDetail> {
        const county_data = this.http.get<CountyData>(`${HOST}${API}/county/${countyId}/`);
        const case_data = this.http.get<CaseData[]>(`${HOST}${API}/county/${countyId}/cases/`)
        const demographic_data = this.http.get<DemographicData[]>(`${HOST}${API}/county/${countyId}/gender_age/latest/`);
        return this.formatCountyDetail(county_data, case_data, demographic_data);
    }

    // public for testing
    formatCountyDetail(county_data: Observable<CountyData>, case_data: Observable<CaseData[]>, demographic_data: Observable<DemographicData[]>): Observable<CountyDetail> {
        return combineLatest(county_data, case_data, demographic_data).pipe(
            map(([county, cases, demographics]) => { 
                const result = {                
                    name: county.gen + " (" + county.bez + ")",
                    county_id: county.ags,
                    population: county.population,
                    latest_report_date: cases.length > 0 ? formatDate(cases[0].date_day, "dd.MM.yy", "de_DE") : "",
                    infected_total: cases.length > 0 ? cases[0].infected_total : 0,                    
                    infected_by_100k: undefined,
                    incidenceAssessment: undefined,
                    trend: this.getTrend(cases),
                    trendAssessment: undefined,
                    deaths_total: cases.length > 0 ? cases[0].deaths_total : 0,
                    new_cases: this.getNumberOfNewCases(cases),
                    male_percentage: this.getGenderPercentage(demographics, "m"),
                    female_percentage: this.getGenderPercentage(demographics, "w"),
                    case_history: this.getCaseHistory(cases),
                    age_groups: this.getAgeGroups(demographics),
                    recovery_time: this.RECOVERY_TIME,
                }
                result.infected_by_100k = Math.round((result.infected_total / result.population) * 100000);
                result.incidenceAssessment = this.getIncidenceAssessment(result.infected_by_100k);
                result.trendAssessment = this.getTrendAssessment(result.trend);
                return result;
            })
        );
    }

    private getIncidenceAssessment(infected_by_100k: number): Assessment {
        // Incidence classification similar to corona.rki.de
        if (infected_by_100k < 34) {
            return Assessment.VERY_GOOD;
        } else if (infected_by_100k < 59) {
            return Assessment.GOOD;
        } else if (infected_by_100k < 93) {
            return Assessment.MEDIUM;
        } else if (infected_by_100k < 159) {
            return Assessment.BAD;
        } else if (infected_by_100k < 313) {
            return Assessment.VERY_BAD;
        } else {
            return Assessment.EXTREMELY_BAD;
        }
    }

    private getTrend(cases: CaseData[]): number {
        if (cases.length === 0) {
            return undefined;
        }
        const latest_case_data = cases[0];
        const base_date = moment(latest_case_data.date_day).subtract(7, "days");        
        const base_case_data = cases.find(c => moment(c.date_day).isSameOrBefore(base_date));
        return base_case_data ? (latest_case_data.infected_total / base_case_data.infected_total) : undefined;
    }

    private getTrendAssessment(trend: number): Assessment {
        if (trend < 1.75) {
            return Assessment.VERY_GOOD;
        } else if (trend < 2.5) {
            return Assessment.GOOD;
        } else if (trend < 3.25) {
            return Assessment.MEDIUM;
        } else if (trend < 4.0) {
            return Assessment.BAD;
        } else if (trend < 4.75) {
            return Assessment.VERY_BAD;
        } else {
            return Assessment.EXTREMELY_BAD;
        }
    }

    private getNumberOfNewCases(cases: CaseData[]): number {
        switch (cases.length) {
            case 0: return 0;
            case 1: return cases[0].infected_total;
            default: return cases[0].infected_total - cases[1].infected_total;
        }
    }

    private getGenderPercentage(demographics: DemographicData[], gender: string): number {
        let infected_gender = 0, infected_total = 0;      
        demographics.forEach((demographic) => {      
            infected_total += demographic.infected_total;
            if (demographic.gender === gender) {
                infected_gender += demographic.infected_total;
            }            
        });
        return Math.round((infected_gender / infected_total) * 100);
    }

    private getCaseHistory(cases: CaseData[]): CaseHistory[] {
        const result = [];
        for (let i = 0; i < cases.length; i++) {
            const formattedDate = formatDate(cases[i].date_day, "dd.MM", "de_DE");
            if (i == cases.length - 1) {                
                result.push({
                    date: cases[i].date_day,
                    infected_total: cases[i].infected_total,
                    infected_increment: 0,
                    deaths_total: cases[i].deaths_total,
                    deaths_increment: 0,
                    recoveries_total: 0,
                });
            } else {
                result.push({
                    date: cases[i].date_day,
                    infected_total: cases[i].infected_total,
                    infected_increment: cases[i].infected_total - cases[i + 1].infected_total,
                    deaths_total: cases[i].deaths_total,
                    deaths_increment: cases[i].deaths_total - cases[i + 1].deaths_total,
                    recoveries_total: 0,
                });
            }
        }
        if (cases.length > 0) {
            this.calculateRecoveries(result, this.RECOVERY_TIME);
        }
        return result;
    }

    public calculateRecoveries(result: CaseHistory[], recoveryTime: number) {
        const deaths_at_end = result[0].deaths_total;
        for (let i = 0; i < result.length; i++) {
            const indexForDaysAgo = this.getIndexForDaysAgo(result, i, recoveryTime);
            if (indexForDaysAgo != -1) {
                result[i].recoveries_total = Math.max(0, result[indexForDaysAgo].infected_total - deaths_at_end);
            } else {
                result[i].recoveries_total = 0;
            }
        }
    }

    private getIndexForDaysAgo(result: CaseHistory[], currentIndex: number, recoveryTime: number): number {
        const beforeCurrent = moment(result[currentIndex].date).subtract(recoveryTime, "days");
        for (let i = currentIndex; i < result.length; i++) {
            if (moment(result[i].date).isSameOrBefore(beforeCurrent)) {
                return i;
            }
        }
        return -1;
    }

    private getAgeGroups(demographics: DemographicData[]): AgeGroup[] {
        const infected_by_group = new Map();
        const dead_by_group = new Map();
        const infected_by_group_male = new Map();
        const dead_by_group_male = new Map();
        const infected_by_group_female = new Map();
        const dead_by_group_female = new Map();
        demographics.forEach(demographic => {
            const age_group = demographic.age_group;
            this.updateMap(infected_by_group, age_group, demographic.infected_total);
            this.updateMap(dead_by_group, age_group, demographic.deaths_total);
            if (demographic.gender === "m") {
                this.updateMap(infected_by_group_male, age_group, demographic.infected_total);
                this.updateMap(dead_by_group_male, age_group, demographic.deaths_total);
            }
            if (demographic.gender === "w") {
                this.updateMap(infected_by_group_female, age_group, demographic.infected_total);
                this.updateMap(dead_by_group_female, age_group, demographic.deaths_total);
            }
        });                
        return this.PREDEFINED_AGE_GROUPS.map((p) => { 
            return {
                range: p,
                infected_total: infected_by_group.get(p) ?? 0,
                deaths_total: dead_by_group.get(p) ?? 0,
                infected_male: infected_by_group_male.get(p) ?? 0,
                infected_female: infected_by_group_female.get(p) ?? 0,
                deaths_male: dead_by_group_male.get(p) ?? 0,
                deaths_female: dead_by_group_female.get(p) ?? 0,
            }
        });
    }

    private updateMap(map: any, age_group: string, value: number) {
        if (map.has(age_group)) {
            map.set(age_group, map.get(age_group) + value);
        } else {
            map.set(age_group, value);
        }
    }
}