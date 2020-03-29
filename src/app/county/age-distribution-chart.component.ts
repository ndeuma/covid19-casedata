import { Component, Input, OnInit } from "@angular/core";
import { CountyDetail } from './county-detail';
import { Chart } from "chart.js";
import { BrowserTransferStateModule } from '@angular/platform-browser';

@Component({
    selector: "casedata-age-distribution-chart",
    templateUrl: "age-distribution-chart.component.html",
})
export class AgeDistributionChartComponent implements OnInit {

    @Input()
    countyDetail: CountyDetail;

    ngOnInit(): void {
        const ctx = document.getElementById("ageDistributionChart");    
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.countyDetail.age_groups.map(a => a.range),
                datasets: [{
                    label: 'männlich',
                    data: this.countyDetail.age_groups.map(h => h.infected_male),
                    backgroundColor: this.countyDetail.age_groups.map(h => "#0080ff"),
                    borderColor: this.countyDetail.age_groups.map(h => "#a0a0a0"),                        
                    borderWidth: 1
                }, {
                    label: 'weiblich',
                    data: this.countyDetail.age_groups.map(h => h.infected_female),
                    backgroundColor: this.countyDetail.age_groups.map(h => "#20ff00"),
                    borderColor: this.countyDetail.age_groups.map(h => "#a0a0a0"),                        
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            // https://stackoverflow.com/questions/42135058/set-minimum-step-size-in-chart-js
                            callback: function(value, index, values) {
                                if (Math.floor(value) === value) {
                                    return value;
                                }
                            }
                        }
                    }]
                },       
                legend: {
                    position: "bottom"
                }         
            }
        });        
    }
}