import { Component, Input } from "@angular/core";

import { RegionDetail } from "./region-detail";

@Component({
    selector: "casedata-demographic-summary",
    templateUrl: "./demographic-summary.component.html"
})
export class DemographicSummaryComponent {

    @Input()
    regionDetail: RegionDetail;
}
