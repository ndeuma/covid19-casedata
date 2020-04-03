import { Injectable } from "@angular/core";
import { Observable, combineLatest } from "rxjs";

import { RegionData } from "../region/region-data.to";
import { CaseData } from "../region/case-data.to";
import { DemographicData } from "../region/demographic-data.to";
import { RegionDetail, Assessment, CaseHistory, AgeGroup } from "../region/region-detail";

import { map } from "rxjs/operators";
import { formatDate } from "@angular/common";
import * as moment from "moment";
import regression from "regression";

const PREDEFINED_AGE_GROUPS = ["0-4", "5-14", "15-34", "35-59", "60-79", "80+"];

// Estimated recovery time in days
const RECOVERY_TIME = 21;

@Injectable({
    providedIn: "root"
})
export class HealthService {

    generateRegionDetail(
        county_data: Observable<RegionData>, 
        case_data: Observable<CaseData[]>, 
        demographic_data: Observable<DemographicData[]>,
        extendedDataAvailable: boolean
    ): Observable<RegionDetail> {
        return combineLatest(county_data, case_data, demographic_data).pipe(
            map(([county, cases, demographics]) => { 
                const result = {               
                    extendedDataAvailable: extendedDataAvailable, 
                    name: county.gen + " (" + county.bez + ")",
                    county_id: county.ags,
                    population: county.population,
                    latest_report_date: cases.length > 0 ? formatDate(cases[0].date_day, "dd.MM.yy", "de_DE") : "",
                    infected_total: cases.length > 0 ? cases[0].infected_total : 0,                    
                    infected_by_100k: undefined,
                    incidenceAssessment: undefined,
                    trend: getTrend(cases),
                    trendAssessment: undefined,
                    regression: getRegression(cases),
                    regressionAssessment: undefined,
                    deaths_total: cases.length > 0 ? cases[0].deaths_total : 0,
                    new_cases: getNumberOfNewCases(cases),
                    male_percentage: getGenderPercentage(demographics, "m"),
                    female_percentage: getGenderPercentage(demographics, "w"),
                    case_history: getCaseHistory(cases, extendedDataAvailable),
                    age_groups: getAgeGroups(demographics),
                    recovery_time: RECOVERY_TIME,
                }
                result.infected_by_100k = Math.round((result.infected_total / result.population) * 100000);
                result.incidenceAssessment = getIncidenceAssessment(result.infected_by_100k);
                result.trendAssessment = getTrendAssessment(result.trend);
                result.regressionAssessment = getRegressionAssessment(result.regression);
                return result;
            })
        );
    }
}

function getIncidenceAssessment(infected_by_100k: number): Assessment {
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

function getTrend(cases: CaseData[]): number {
    if (cases.length === 0) {
        return undefined;
    }
    const latest_case_data = cases[0];
    const base_date = moment(latest_case_data.date_day).subtract(7, "days");        
    const base_case_data = cases.find(c => moment(c.date_day).isSameOrBefore(base_date));
    return base_case_data ? (latest_case_data.infected_total / base_case_data.infected_total) : undefined;
}

function getTrendAssessment(trend: number): Assessment {
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

function getRegressionAssessment(regression: number): Assessment {
    if (regression < -0.4) {
        return Assessment.VERY_GOOD;
    } else if (regression < 0) {
        return Assessment.GOOD;
    } else if (regression < 0.1) {
        return Assessment.MEDIUM;
    } else if (regression < 0.3) {
        return Assessment.BAD;
    } else if (regression < 0.5) {
        return Assessment.VERY_BAD;
    } else {
        return Assessment.EXTREMELY_BAD;
    }
}

function getRegression(cases: CaseData[]): number {    
    const latest_case_data = cases[0];    
    const normalizationFactor = cases[0].infected_total / 100;
    const base_date = moment(latest_case_data.date_day).subtract(7, "days");        
    const input = cases.filter((c) => moment(c.date_day).isAfter(base_date)).reverse().map((c, idx) => [idx, c.infected_total / normalizationFactor]);    
    if (input.length < 3) {
        return 0;
    }
    const regr = regression.polynomial(input, { order: 2});     
    return regr.equation[0];
}

function getNumberOfNewCases(cases: CaseData[]): number {
    switch (cases.length) {
        case 0: return 0;
        case 1: return cases[0].infected_total;
        default: return cases[0].infected_total - cases[1].infected_total;
    }
}

function getGenderPercentage(demographics: DemographicData[], gender: string): number {
    let infected_gender = 0, infected_total = 0;      
    demographics.forEach((demographic) => {      
        infected_total += demographic.infected_total;
        if (demographic.gender === gender) {
            infected_gender += demographic.infected_total;
        }            
    });
    return Math.round((infected_gender / infected_total) * 100);
}

function getCaseHistory(cases: CaseData[], extendedDataAvailable: boolean): CaseHistory[] {
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
    if (cases.length > 0 && extendedDataAvailable) {
        calculateRecoveries(result, RECOVERY_TIME);
    }
    return result;
}

export function calculateRecoveries(result: CaseHistory[], recoveryTime: number) {
    const deaths_at_end = result[0].deaths_total;
    for (let i = 0; i < result.length; i++) {
        const indexForDaysAgo = getIndexForDaysAgo(result, i, recoveryTime);
        if (indexForDaysAgo != -1) {
            result[i].recoveries_total = Math.max(0, result[indexForDaysAgo].infected_total - deaths_at_end);
        } else {
            result[i].recoveries_total = 0;
        }
    }
}

function getIndexForDaysAgo(result: CaseHistory[], currentIndex: number, recoveryTime: number): number {
    const beforeCurrent = moment(result[currentIndex].date).subtract(recoveryTime, "days");
    for (let i = currentIndex; i < result.length; i++) {
        if (moment(result[i].date).isSameOrBefore(beforeCurrent)) {
            return i;
        }
    }
    return -1;
}

function getAgeGroups(demographics: DemographicData[]): AgeGroup[] {
    const infected_by_group = new Map();
    const dead_by_group = new Map();
    const infected_by_group_male = new Map();
    const dead_by_group_male = new Map();
    const infected_by_group_female = new Map();
    const dead_by_group_female = new Map();
    demographics.forEach(demographic => {
        const age_group = demographic.age_group;
        updateMap(infected_by_group, age_group, demographic.infected_total);
        updateMap(dead_by_group, age_group, demographic.deaths_total);
        if (demographic.gender === "m") {
            updateMap(infected_by_group_male, age_group, demographic.infected_total);
            updateMap(dead_by_group_male, age_group, demographic.deaths_total);
        }
        if (demographic.gender === "w") {
            updateMap(infected_by_group_female, age_group, demographic.infected_total);
            updateMap(dead_by_group_female, age_group, demographic.deaths_total);
        }
    });                
    return PREDEFINED_AGE_GROUPS.map((p) => { 
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

function updateMap(map: any, age_group: string, value: number) {
    if (map.has(age_group)) {
        map.set(age_group, map.get(age_group) + value);
    } else {
        map.set(age_group, value);
    }
}    