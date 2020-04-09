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

    private isState(): boolean {
        return this.regionDetail.regionType === "state";
    }

    private drawChart(): void {
        const ctx = document.getElementById("historyChart");

        // Case history needs to be reversed to that the latest numbers are displayed on the right.
        const caseHistoryReversed = this.regionDetail.case_history.slice(0, 14).reverse();

        const datasets = [];
        datasets.push({
            label: (!this.isState()) ? "Gerade krank" : "Fälle",
            // Total bar height should be number of infected, not number of infected + number of deaths here
            // So we need to subtract the number of deaths here, and add it again for the numbers in the tooltip (see below)
            data: caseHistoryReversed.map(h => h.infected_total - h.deaths_total - h.recoveries_total),
            backgroundColor: "#0080ff",
            borderColor: "#0080ff",
            pointRadius: 0,
            borderWidth: 1,
            fill: "start",
            lineTension: 0
        });
        if (!this.isState()) {
            datasets.push({
                label: "Todesfälle",
                data: caseHistoryReversed.map(h => h.deaths_total),
                backgroundColor: "#000000",
                borderColor: "#000000",
                pointRadius: 0,
                borderWidth: 0,
                fill: "-1",
                lineTension: 0
            });
            datasets.push({
                label: "Genesungen",
                data: caseHistoryReversed.map(h => h.recoveries_total),
                backgroundColor: "#006400",
                borderColor: "#006400",
                pointRadius: 0,
                borderWidth: 0,
                fill: "-1",
                lineTension: 0
            });
        }
        // tslint:disable-next-line: no-unused-expression
        new Chart(ctx, {
            type: "line",
            data: {
                labels: caseHistoryReversed.map(h => formatDate(h.date, "dd.MM", "de_DE") ),
                datasets: datasets
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
                            if (item.datasetIndex === 1 && chart.datasets[1].data.every((value) => value === 0)) {
                                    return false;
                            }
                            if (item.datasetIndex === 2 && chart.datasets[2].data.every((value) => value === 0)) {
                                return false;
                            }
                            return true;
                        }
                    }
                },
                tooltips: {
                    intersect: false,
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
                            const cases = data.datasets[0].data[tooltipItem.index];
                            const tooltipLines = [];
                            if (!this.isState()) {
                                const currentDead = data.datasets[1].data[tooltipItem.index];
                                const currentRecovered = data.datasets[2].data[tooltipItem.index];
                                const total = cases + currentRecovered + currentDead;
                                tooltipLines.push(`insgesamt: ${total}`);
                                tooltipLines.push(
                                    `gerade krank: ${cases}`,
                                    `genesen: ${currentRecovered}`,
                                    `Todesfälle: ${currentDead}`,
                                );
                            } else {
                                tooltipLines.push(`Fälle: ${cases}`);
                            }
                            return tooltipLines;
                        }
                    }
                },
                options: {
                    plugins: {
                        filler: {
                            propagate: true
                        }
                    }
                }
            }
        });
    }
}
