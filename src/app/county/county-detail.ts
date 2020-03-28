export interface AgeGroup {
    range: string;
    infected_total: number;
    deaths_total: number;
}

export interface CaseHistory {
    date: string;
    infected_total: number;
    infected_increment: number;
    deaths_total: number;
    deaths_increment: number;
}

export interface CountyDetail {
    name: string;
    county_id: string;
    population: number;
    latest_report_date: string;
    infected_total: number;
    deaths_total: number;
    new_cases: number;
    male_percentage: number;
    female_percentage: number;    
    case_history: CaseHistory[];
    age_groups: AgeGroup[];
}