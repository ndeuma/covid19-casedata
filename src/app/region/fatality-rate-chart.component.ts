import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { RegionDetail } from "./region-detail";
import { Chart } from "chart.js";

@Component({
    selector: "casedata-fatality-rate-chart",
    templateUrl: "fatality-rate-chart.component.html",
})
export class FatalityRateChartComponent implements OnChanges {

    @Input()
    regionDetail: RegionDetail;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.regionDetail) {
            this.drawChart();
        }
    }

    private drawChart(): void {
        const ctx = document.getElementById("fatalityRateChart");
        // tslint:disable-next-line: no-unused-expression
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: this.regionDetail.age_groups.map(a => a.range),
                datasets: [{
                    label: "Todesfälle",
                    data: this.regionDetail.age_groups.map(h => h.deaths_total),
                    backgroundColor: this.regionDetail.age_groups.map(h => "#000000"),
                    borderColor: this.regionDetail.age_groups.map(h => "#000000"),
                    borderWidth: 1
                }, {
                    // Total bar height should be number of infected, not number of infected + number of deaths here
                    // So we need to subtract the number of deaths here, and add it again for the numbers in the tooltip (see below)
                    label: "Fälle",
                    data: this.regionDetail.age_groups.map(h => h.infected_total - h.deaths_total),
                    backgroundColor: this.regionDetail.age_groups.map(h => "#0080ff"),
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
                            const currentDead = data.datasets[0].data[tooltipItem.index];
                            const currentInfected = currentDead + data.datasets[1].data[tooltipItem.index];
                            return [
                                `${data.datasets[1].label}: ${currentInfected}`,
                                `${data.datasets[0].label}: ${currentDead} (${Math.round((currentDead / currentInfected) * 100)}%)`,
                            ];
                        }
                    }
                }
            }
        });
    }
}
