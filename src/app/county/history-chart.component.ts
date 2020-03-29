import { Component, Input, OnInit } from "@angular/core";
import { CountyDetail } from './county-detail';
import { Chart } from "chart.js";

@Component({
    selector: "casedata-history-chart",
    templateUrl: "history-chart.component.html",
})
export class HistoryChartComponent implements OnInit {

    @Input()
    countyDetail: CountyDetail;

    ngOnInit(): void {
        const ctx = document.getElementById("historyChart");
        // Case history needs to be reversed to that the latest numbers are displayed on the right.
        const caseHistoryReversed = this.countyDetail.case_history.reverse();    
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: caseHistoryReversed.map(h => h.date),
                datasets: [{
                    label: 'Todesfälle',
                    data: caseHistoryReversed.map(h => h.deaths_total),
                    backgroundColor: caseHistoryReversed.map(h => "#000000"),
                    borderColor: caseHistoryReversed.map(h => "#000000"),                        
                    borderWidth: 1
                }, {
                    label: 'Fälle',
                    data: caseHistoryReversed.map(h => h.infected_total - h.deaths_total),
                    backgroundColor: caseHistoryReversed.map(h => "#0080ff"),
                    borderColor: caseHistoryReversed.map(h => "#a0a0a0"),                        
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
                        },
                        stacked: true
                    }],
                    xAxes: [{
                        stacked: true
                    }]
                },
                legend: {
                    position: "bottom"
                }
            }
        });        
    }
}