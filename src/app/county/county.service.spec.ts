import { CountyService } from "./county.service";
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { from } from 'rxjs';
import { CountyData } from './county-data.to';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { CaseData } from './case-data.to';


const testCounty: CountyData = {
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
    intensive_total: 12,
    immune_total: 20,
    date_day: "2020-03-25",
    last_updated: "2020-03-25",
}

describe("County details...", () => {
    
    let service: CountyService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [CountyService]
        });
        registerLocaleData(localeDe, 'de');
        service = TestBed.get(CountyService);
    }); 
    
    it("...are displayed correctly when there are no recorded days of cases", (done: DoneFn) => {        
        const countyDetail = service.formatCountyDetail(
            from([testCounty]),
            from([[]]),
            from([[]]),
        );  
        countyDetail.subscribe(actual => {
            expect(actual.infected_total).toEqual(0);
            expect(actual.deaths_total).toEqual(0);
            expect(actual.new_cases).toEqual(0);
            expect(actual.latest_report_date).toEqual("");
            done();
        })
    });

    it("...are displayed correctly when there is only a single recorded day of cases", (done: DoneFn) => {        
        const countyDetail = service.formatCountyDetail(
            from([testCounty]),
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
        );  
        countyDetail.subscribe(actual => {
            expect(actual.infected_total).toEqual(100);
            expect(actual.deaths_total).toEqual(8);
            expect(actual.new_cases).toEqual(100);
            done();
        })
    });

    it("...are displayed correctly when demographic data is empty", (done: DoneFn) => {        
        const countyDetail = service.formatCountyDetail(
            from([testCounty]),
            from([[latestTestCaseData, {
                infected_total: 30,
                deaths_total: 4,
                intensive_total: 9,
                immune_total: 20,
                date_day: "2020-03-24",
                last_updated: "2020-03-24",
            }]]),
            from([[]]),
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
            })
            done();
        })
    });
});