import { NumberSymbol } from '@angular/common';

export interface AgeGroup {
    range: string;
    infected_total: number;
    deaths_total: number;
    infected_male: number;
    infected_female: number;
    deaths_male: number;
    deaths_female: number;
}

export interface CaseHistory {
    date: string;
    infected_total: number;
    infected_increment: number;
    deaths_total: number;
    deaths_increment: number;
}

export interface Incidence {
    displayClass: string,
    label: string;
}

export interface CountyDetail {
    name: string;
    county_id: string;
    population: number;
    latest_report_date: string;
    infected_total: number;
    infected_by_100k: number | undefined;
    incidence: Incidence | undefined;
    deaths_total: number;
    new_cases: number;
    male_percentage: number;
    female_percentage: number;    
    case_history: CaseHistory[];
    age_groups: AgeGroup[];
}