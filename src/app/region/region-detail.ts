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
    recoveries_total: number;
}


export class Assessment {

    static readonly VERY_GOOD = new Assessment("very-low", "sehr niedrig", "sehr gut", "schnell flacher werdend");
    static readonly GOOD = new Assessment("low", "niedrig", "gut", "flacher werdend");
    static readonly MEDIUM = new Assessment("medium", "mittel", "mittel", "etwa gerade");
    static readonly BAD = new Assessment("high", "hoch", "schlecht", "etwas steiler werdend");
    static readonly VERY_BAD = new Assessment("very-high", "sehr hoch", "sehr schlecht", "steiler werdend");
    static readonly EXTREMELY_BAD = new Assessment("extremely-high", "extrem hoch", "extrem schlecht", "schnell steiler werdend");

    private constructor(
        readonly displayClass: string,
        readonly labelForIncidence: string,
        readonly labelForTrend: string,
        readonly labelForCurve: string,
    ) { }

}

export type RegionType = "county" | "state" | "country";
export interface RegionDetail {
    regionType: RegionType;
    name: string;
    county_id: string;
    population: number;
    latest_report_date: string;
    infected_total: number;
    infected_by_100k: number | undefined;
    incidenceAssessment: Assessment | undefined;
    trend: number | undefined;
    trendAssessment: Assessment | undefined;
    regression: number;
    regressionAssessment: Assessment;
    deaths_total: number;
    new_cases: number;
    male_percentage: number;
    female_percentage: number;
    case_history: CaseHistory[];
    age_groups: AgeGroup[];
    recovery_time: number;
}
