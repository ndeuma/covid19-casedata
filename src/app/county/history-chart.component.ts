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
        const caseHistoryReversed = this.countyDetail.case_history.reverse();    
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: caseHistoryReversed.map(h => h.date),
                datasets: [{
                    label: 'Fälle',
                    data: caseHistoryReversed.map(h => h.infected_total),
                    backgroundColor: caseHistoryReversed.map(h => "#0080ff"),
                    borderColor: caseHistoryReversed.map(h => "#a0a0a0"),                        
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