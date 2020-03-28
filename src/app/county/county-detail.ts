export interface AgeGroup {
    range: string;
    infected_total: number;
    deaths_total: number;
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
    age_groups: AgeGroup[];
}