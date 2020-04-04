import { Injectable } from "@angular/core";
import { Observable, combineLatest } from "rxjs";

import { RegionData } from "../region/region-data.to";
import { CaseData } from "../region/case-data.to";
import { DemographicData } from "../region/demographic-data.to";
import { RegionDetail, RegionType, Assessment, CaseHistory, AgeGroup } from "../region/region-detail";

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
        regionData: Observable<RegionData>,
        caseData: Observable<CaseData[]>,
        demographicData: Observable<DemographicData[]>,
        regionType: RegionType
    ): Observable<RegionDetail> {
        return combineLatest([regionData, caseData, demographicData]).pipe(
            map(([county, cases, demographics]) => {
                const result = {
                    regionType: regionType,
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
                    case_history: getCaseHistory(cases, regionType !== "state"),
                    age_groups: getAgeGroups(demographics),
                    recovery_time: RECOVERY_TIME,
                };
                result.infected_by_100k = Math.round((result.infected_total / result.population) * 100000);
                result.incidenceAssessment = getIncidenceAssessment(result.infected_by_100k);
                result.trendAssessment = getTrendAssessment(result.trend);
                result.regressionAssessment = getCurveAssessment(result.regression);
                return result;
            })
        );
    }
}

function getIncidenceAssessment(infectedBy100k: number): Assessment {
    // Incidence classification similar to corona.rki.de
    if (infectedBy100k < 59) {
        return Assessment.VERY_GOOD;
    } else if (infectedBy100k < 104) {
        return Assessment.GOOD;
    } else if (infectedBy100k < 166) {
        return Assessment.MEDIUM;
    } else if (infectedBy100k < 287) {
        return Assessment.BAD;
    } else if (infectedBy100k < 552) {
        return Assessment.VERY_BAD;
    } else {
        return Assessment.EXTREMELY_BAD;
    }
}

function getTrend(cases: CaseData[]): number {
    if (cases.length === 0) {
        return undefined;
    }
    const latestCaseData = cases[0];
    const baseDate = moment(latestCaseData.date_day).subtract(7, "days");
    const baseCaseData = cases.find(c => moment(c.date_day).isSameOrBefore(baseDate));
    return baseCaseData ? (latestCaseData.infected_total / baseCaseData.infected_total) : undefined;
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

function getCurveAssessment(secondDerivative: number): Assessment {
    if (secondDerivative < -0.4) {
        return Assessment.VERY_GOOD;
    } else if (secondDerivative < 0) {
        return Assessment.GOOD;
    } else if (secondDerivative < 0.1) {
        return Assessment.MEDIUM;
    } else if (secondDerivative < 0.3) {
        return Assessment.BAD;
    } else if (secondDerivative < 0.5) {
        return Assessment.VERY_BAD;
    } else {
        return Assessment.EXTREMELY_BAD;
    }
}

function getRegression(cases: CaseData[]): number {
    if (cases.length > 0) {
        const latestCaseData = cases[0];
        const normalizationFactor = cases[0].infected_total / 100;
        const baseDate = moment(latestCaseData.date_day).subtract(7, "days");
        const input = cases
            .filter((c) => moment(c.date_day).isAfter(baseDate))
            .reverse()
            .map((c, idx) => [idx, c.infected_total / normalizationFactor]);
        if (input.length > 2) {
            const regr = regression.polynomial(input, { order: 2});
            return regr.equation[0];
        }
    }

    return 0;
}

function getNumberOfNewCases(cases: CaseData[]): number {
    switch (cases.length) {
        case 0: return 0;
        case 1: return cases[0].infected_total;
        default: return cases[0].infected_total - cases[1].infected_total;
    }
}

function getGenderPercentage(demographics: DemographicData[], gender: string): number {
    let infectedWithGender = 0;
    let infectedTotal = 0;
    demographics.forEach((demographic) => {
        infectedTotal += demographic.infected_total;
        if (demographic.gender === gender) {
            infectedWithGender += demographic.infected_total;
        }
    });
    if (infectedTotal === 0) {
        return 0;
    }
    return Math.round((infectedWithGender / infectedTotal) * 100);
}

function getCaseHistory(cases: CaseData[], canCalculateRecoveries: boolean): CaseHistory[] {
    const result = [];
    for (let i = 0; i < cases.length; i++) {
        if (i === cases.length - 1) {
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
    if (cases.length > 0 && canCalculateRecoveries) {
        calculateRecoveries(result, RECOVERY_TIME);
    }
    return result;
}

export function calculateRecoveries(result: CaseHistory[], recoveryTime: number) {
    const deathsNow = result[0].deaths_total;
    for (let i = 0; i < result.length; i++) {
        const indexForDaysAgo = getIndexForDaysAgo(result, i, recoveryTime);
        if (indexForDaysAgo !== -1) {
            result[i].recoveries_total = Math.max(0, result[indexForDaysAgo].infected_total - deathsNow);
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
    const infectedByGroup = new Map();
    const deadByGroup = new Map();
    const infectedByGroupMale = new Map();
    const deadByGroupMale = new Map();
    const infectedByGroupFemale = new Map();
    const deadByGroupFemale = new Map();
    demographics.forEach(demographic => {
        const age_group = demographic.age_group;
        updateMap(infectedByGroup, age_group, demographic.infected_total);
        updateMap(deadByGroup, age_group, demographic.deaths_total);
        if (demographic.gender === "m") {
            updateMap(infectedByGroupMale, age_group, demographic.infected_total);
            updateMap(deadByGroupMale, age_group, demographic.deaths_total);
        }
        if (demographic.gender === "w") {
            updateMap(infectedByGroupFemale, age_group, demographic.infected_total);
            updateMap(deadByGroupFemale, age_group, demographic.deaths_total);
        }
    });
    return PREDEFINED_AGE_GROUPS.map((p) => {
        return {
            range: p,
            infected_total: infectedByGroup.get(p) ?? 0,
            deaths_total: deadByGroup.get(p) ?? 0,
            infected_male: infectedByGroupMale.get(p) ?? 0,
            infected_female: infectedByGroupFemale.get(p) ?? 0,
            deaths_male: deadByGroupMale.get(p) ?? 0,
            deaths_female: deadByGroupFemale.get(p) ?? 0,
        };
    });
}

function updateMap(numbersByAgeGroup: any, ageGroup: string, value: number) {
    if (numbersByAgeGroup.has(ageGroup)) {
        numbersByAgeGroup.set(ageGroup, numbersByAgeGroup.get(ageGroup) + value);
    } else {
        numbersByAgeGroup.set(ageGroup, value);
    }
}
