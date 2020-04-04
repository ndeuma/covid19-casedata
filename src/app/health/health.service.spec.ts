import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { from } from "rxjs";
import { RegionData } from "../region/region-data.to";
import { registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";
import { CaseData } from "../region/case-data.to";
import { HealthService, calculateRecoveries } from "./health.service";


const testRegion: RegionData = {
    name: "LK Kleinkleckerlasgreuth",
    ags: "999999",
    state: "Bayern",
    bez: "Landkreis",
    gen: "Kleinkleckerlasgreuth",
    population: 20000,
    population_density_km: 50,
    population_male: 10000,
    population_female: 10000,
};

const latestTestCaseData: CaseData = {
    infected_total: 100,
    deaths_total: 8,
    date_day: "2020-03-25",
};

describe("Region details...", () => {

    let service: HealthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [HealthService]
        });
        registerLocaleData(localeDe, "de");
        service = TestBed.inject(HealthService);
    });

    it("...are displayed correctly when there are no recorded days of cases", (done: DoneFn) => {
        const countyDetail = service.generateRegionDetail(
            from([testRegion]),
            from([[]]),
            from([[]]),
            "county"
        );
        countyDetail.subscribe(actual => {
            expect(actual.infected_total).toEqual(0);
            expect(actual.deaths_total).toEqual(0);
            expect(actual.new_cases).toEqual(0);
            expect(actual.latest_report_date).toEqual("");
            done();
        });
    });

    it("...are displayed correctly when there is only a single recorded day of cases", (done: DoneFn) => {
        const countyDetail = service.generateRegionDetail(
            from([testRegion]),
            from([[latestTestCaseData]]),
            from([[{
                infected_total: 50,
                deaths_total: 4,
                gender: "m",
                age_group: "15-34",
                date_day: "2020-03-25",
                last_updated: "2020-03-25",
            }, {
                infected_total: 50,
                deaths_total: 4,
                gender: "w",
                age_group: "15-34",
                date_day: "2020-03-25",
                last_updated: "2020-03-25",
            }]]),
            "county"
        );
        countyDetail.subscribe(actual => {
            expect(actual.infected_total).toEqual(100);
            expect(actual.deaths_total).toEqual(8);
            expect(actual.new_cases).toEqual(100);
            done();
        });
    });

    it("...are displayed correctly when demographic data is empty", (done: DoneFn) => {
        const countyDetail = service.generateRegionDetail(
            from([testRegion]),
            from([[latestTestCaseData, {
                infected_total: 30,
                deaths_total: 4,
                intensive_total: 9,
                immune_total: 20,
                date_day: "2020-03-24",
                last_updated: "2020-03-24",
            }]]),
            from([[]]),
            "county"
        );
        countyDetail.subscribe(actual => {
            expect(actual.infected_total).toEqual(100);
            expect(actual.deaths_total).toEqual(8);
            expect(actual.new_cases).toEqual(70);
            expect(actual.latest_report_date).toEqual("25.03.20");
            expect(actual.age_groups.length).toEqual(6);
            actual.age_groups.forEach(ageGroup => {
                expect(ageGroup.infected_total).toEqual(0);
                expect(ageGroup.deaths_total).toEqual(0);
                expect(ageGroup.infected_male).toEqual(0);
                expect(ageGroup.deaths_male).toEqual(0);
                expect(ageGroup.infected_female).toEqual(0);
                expect(ageGroup.deaths_female).toEqual(0);
            });
            done();
        });
    });

    it("...have recoveries computed correctly", (done: DoneFn) => {
        const input = [{
            date: "2020-03-16", infected_total: 4, deaths_total: 1, infected_increment: 0, deaths_increment: 0, recoveries_total: 0,
        }, {
            date: "2020-03-13", infected_total: 4, deaths_total: 1, infected_increment: 2, deaths_increment: 1, recoveries_total: 0,
        }, {
            date: "2020-03-12", infected_total: 2, deaths_total: 0, infected_increment: 1, deaths_increment: 0, recoveries_total: 0,
        }, {
            date: "2020-03-10", infected_total: 1, deaths_total: 0, infected_increment: 0, deaths_increment: 0, recoveries_total: 0,
        }];
        calculateRecoveries(input, 3);
        // The two new cases from 03-13, and of the first two cases have recovered
        expect(input[0].recoveries_total).toEqual(3);
        // 03-13: First case may have recovered, but we have one dead (could be this case)
        expect(input[1].recoveries_total).toEqual(0);
        // 03-12: First case still infected, second case has just been infected
        expect(input[2].recoveries_total).toEqual(0);
        // 03-10: First case has just been infected
        expect(input[3].recoveries_total).toEqual(0);
        done();
    });
});
