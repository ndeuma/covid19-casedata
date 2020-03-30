import { NumberSymbol } from '@angular/common';
import { GroupedObservable } from 'rxjs';

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


export class Assessment {

    static readonly VERY_GOOD = new Assessment("very-low", "sehr niedrig", "sehr gut");
    static readonly GOOD = new Assessment("low", "niedrig", "gut");
    static readonly MEDIUM = new Assessment("medium", "mittel", "mittel");
    static readonly BAD = new Assessment("high", "hoch", "schlecht");
    static readonly VERY_BAD = new Assessment("very-high", "sehr hoch", "sehr schlecht");
    static readonly EXTREMELY_BAD = new Assessment("extremely-high", "extrem hoch", "extrem schlecht");

    private constructor(readonly displayClass: string, readonly labelForIncidence: string, readonly labelForTrend: string) { }

}

export interface CountyDetail {
    name: string;
    county_id: string;
    population: number;
    latest_report_date: string;
    infected_total: number;
    infected_by_100k: number | undefined;
    incidenceAssessment: Assessment | undefined;
    trend: number | undefined;
    trendAssessment: Assessment | undefined;
    deaths_total: number;
    new_cases: number;
    male_percentage: number;
    female_percentage: number;    
    case_history: CaseHistory[];
    age_groups: AgeGroup[];
}