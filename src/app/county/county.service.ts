import { Injectable } from '@angular/core';
import { HOST, API } from '../deployment';
import { HttpClient } from '@angular/common/http';
import { CountyData } from './county-data.to';
import { CaseData } from './case-data.to';
import { DemographicData } from './demographic-data.to';
import { Observable, combineLatest } from 'rxjs';
import { CountyDetail, AgeGroup } from './county-detail';
import { take, map, filter } from 'rxjs/operators';

@Injectable({
    providedIn: "root"
})
export class CountyService {

    constructor(private readonly http: HttpClient) { }

    private readonly PREDEFINED_AGE_GROUPS = ["0-4", "5-14", "15-34", "35-59", "60-79", "80+"];

    getCounties(): Observable<CountyData[]> {
        return this.http.get<CountyData[]>(`${HOST}${API}/county/`);       
    }

    getCounty(countyId: string): Observable<CountyData> {
        return this.http.get<CountyData>(`${HOST}${API}/county/${countyId}/`);         
    }

    getCountyDetail(countyId: string): Observable<CountyDetail> {
        const county_data = this.http.get<CountyData>(`${HOST}${API}/county/${countyId}/`);
        const case_data = this.http.get<CaseData[]>(`${HOST}${API}/county/${countyId}/cases/`)
        const demographic_data = this.http.get<DemographicData[]>(`${HOST}${API}/county/${countyId}/gender_age/`);
        return this.formatCountyDetail(county_data, case_data, demographic_data);
    }

    formatCountyDetail(county_data: Observable<CountyData>, case_data: Observable<CaseData[]>, demographic_data: Observable<DemographicData[]>): Observable<CountyDetail> {
        return combineLatest(county_data, case_data, demographic_data).pipe(
            map(([county, cases, demographics]) => { 
                let filtered_demographics = this.filterByLatestDate(demographics);
                return {                
                    name: county.name,
                    county_id: county.ags,
                    population: county.population,
                    latest_report_date: cases[0].date_day,
                    infected_total: cases[0].infected_total,
                    deaths_total: cases[0].deaths_total,
                    new_cases: cases[0].infected_total - cases[1].infected_total,
                    male_percentage: this.getGenderPercentage(filtered_demographics, "m"),
                    female_percentage: this.getGenderPercentage(filtered_demographics, "w"),
                    age_groups: this.getAgeGroups(filtered_demographics),
                }
            })
        );
    }

    private filterByLatestDate(demographics: DemographicData[]): DemographicData[] {
        let latest = "";
        demographics.forEach((demographic) => {
            if (demographic.date_day.localeCompare(latest) > 0) {
                latest = demographic.date_day;
            }
        });
        return demographics.filter(demographic => demographic.date_day === latest);
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

    private getAgeGroups(demographics: DemographicData[]): AgeGroup[] {
        const infected_by_group = new Map();
        const dead_by_group = new Map();
        demographics.forEach(demographic => {
            const age_group = demographic.age_group;
            if (infected_by_group.has(age_group)) {
                infected_by_group.set(age_group, infected_by_group.get(age_group) + demographic.infected_total);
            } else {
                infected_by_group.set(age_group, demographic.infected_total);
            }
            if (dead_by_group.has(age_group)) {
                dead_by_group.set(age_group, dead_by_group.get(age_group) + demographic.deaths_total);
            } else {
                dead_by_group.set(age_group, demographic.deaths_total);
            }
        });                
        return this.PREDEFINED_AGE_GROUPS.map((p) => { 
            return {
                range: p,
                infected_total: infected_by_group.get(p) ?? 0,
                deaths_total: dead_by_group.get(p) ?? 0,
            }
        });
    }
}