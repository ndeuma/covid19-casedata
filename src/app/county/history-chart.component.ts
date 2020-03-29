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
                    // Total bar height should be number of infected, not number of infected + number of deaths here
                    // So we need to subtract the number of deaths here, and add it again for the numbers in the tooltip (see below)
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
                            callback: (value, index, values) => (Math.floor(value) === value) ? value : undefined
                        },
                        stacked: true
                    }],
                    xAxes: [{
                        stacked: true
                    }]
                },
                legend: {
                    position: "bottom",
                    labels: {
                        // Do no display legend when there are no deaths
                        filter: (item, chart) => chart.datasets[0].data.some((value) => value)
                    }
                },
                tooltips: {
                    // https://stackoverflow.com/questions/43793622/how-to-remove-square-label-from-tooltip-and-make-its-information-in-one-line
                    custom: (tooltip) => {
                        if (!tooltip) {
                            return;
                        }
                        // Disable displaying the color box;
                        tooltip.displayColors = false;
                    },
                    callbacks: {                        
                        label: (tooltipItem, data) => {
                            const current_infected_without_dead = data.datasets[1].data[tooltipItem.index];
                            const current_dead = data.datasets[0].data[tooltipItem.index];
                            return [
                                `${data.datasets[1].label}: ${current_infected_without_dead + current_dead}`,
                                `${data.datasets[0].label}: ${current_dead}`,
                            ];
                        }                         
                    } 
                }
            }
        });        
    }
}