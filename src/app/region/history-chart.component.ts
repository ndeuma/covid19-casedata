import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { RegionDetail, RegionType } from "./region-detail";
import { Chart } from "chart.js";
import { formatDate } from "@angular/common";

@Component({
    selector: "casedata-history-chart",
    templateUrl: "history-chart.component.html",
})
export class HistoryChartComponent implements OnChanges {

    @Input()
    regionDetail: RegionDetail;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.regionDetail) {
            this.drawChart();
        }
    }

    private drawChart(): void {
        const ctx = document.getElementById("historyChart");
        // Case history needs to be reversed to that the latest numbers are displayed on the right.
        const caseHistoryReversed = this.regionDetail.case_history.slice(0, 14).reverse();
        // tslint:disable-next-line: no-unused-expression
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: caseHistoryReversed.map(h => formatDate(h.date, "dd.MM", "de_DE") ),
                datasets: [{
                    label: "Todesfälle",
                    data: caseHistoryReversed.map(h => h.deaths_total),
                    backgroundColor: caseHistoryReversed.map(h => "#000000"),
                    borderColor: caseHistoryReversed.map(h => "#000000"),
                    borderWidth: 1
                }, {
                    label: "Genesungen",
                    data: caseHistoryReversed.map(h => h.recoveries_total),
                    backgroundColor: caseHistoryReversed.map(h => "#006400"),
                    borderColor: caseHistoryReversed.map(h => "#006400"),
                    borderWidth: 1
                }, {
                    label: "Fälle",
                    // Total bar height should be number of infected, not number of infected + number of deaths here
                    // So we need to subtract the number of deaths here, and add it again for the numbers in the tooltip (see below)
                    data: caseHistoryReversed.map(h => h.infected_total - h.deaths_total - h.recoveries_total),
                    backgroundColor: caseHistoryReversed.map(h => "#0080ff"),
                    borderColor: caseHistoryReversed.map(h => "#0080ff"),
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
                        // Do no display "Todesfälle" in legend when there are no deaths
                        filter: (item, chart) => {
                            if (item.datasetIndex === 0 && chart.datasets[0].data.every((value) => value === 0)) {
                                    return false;
                            }
                            if (item.datasetIndex === 1 && chart.datasets[1].data.every((value) => value === 0)) {
                                return false;
                            }
                            return true;
                        }
                    }
                },
                tooltips: {
                    // tslint:disable-next-line: max-line-length
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
                            const currentSick = data.datasets[2].data[tooltipItem.index];
                            const currentRecovered = data.datasets[1].data[tooltipItem.index];
                            const currentDead = data.datasets[0].data[tooltipItem.index];
                            const total = currentSick + currentRecovered + currentDead;
                            const tooltipLines = [];
                            tooltipLines.push(`insgesamt: ${total}`);
                            if (this.regionDetail.regionType !== "state") {
                                tooltipLines.push(
                                    `gerade krank: ${currentSick}`,
                                    `genesen: ${currentRecovered}`,
                                    `Todesfälle: ${currentDead}`,
                                );
                            }
                            return tooltipLines;
                        }
                    }
                }
            }
        });
    }
}
