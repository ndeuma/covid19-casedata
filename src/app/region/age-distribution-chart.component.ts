import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { RegionDetail } from './region-detail';
import { Chart } from "chart.js";

@Component({
    selector: "casedata-age-distribution-chart",
    templateUrl: "age-distribution-chart.component.html",
})
export class AgeDistributionChartComponent implements OnChanges {

    @Input()
    regionDetail: RegionDetail;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.regionDetail) {
            this.drawChart();
        }
    }

    private drawChart(): void {
        const ctx = document.getElementById("ageDistributionChart");    
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.regionDetail.age_groups.map(a => a.range),
                datasets: [{
                    label: 'männlich',
                    data: this.regionDetail.age_groups.map(h => h.infected_male),
                    backgroundColor: this.regionDetail.age_groups.map(h => "#0080ff"),
                    borderColor: this.regionDetail.age_groups.map(h => "#a0a0a0"),                        
                    borderWidth: 1
                }, {
                    label: 'weiblich',
                    data: this.regionDetail.age_groups.map(h => h.infected_female),
                    backgroundColor: this.regionDetail.age_groups.map(h => "#20ff00"),
                    borderColor: this.regionDetail.age_groups.map(h => "#a0a0a0"),                        
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