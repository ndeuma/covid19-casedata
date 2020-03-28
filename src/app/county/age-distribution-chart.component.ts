import { Component, Input, OnInit } from "@angular/core";
import { CountyDetail } from './county-detail';
import { Chart } from "chart.js";

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
                    label: 'Fälle',
                    data: this.countyDetail.age_groups.map(h => h.infected_total),
                    backgroundColor: this.countyDetail.age_groups.map(h => "#0080ff"),
                    borderColor: this.countyDetail.age_groups.map(h => "#a0a0a0"),                        
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                legend: {
                    display: false
                }
            }
        });        
    }
}