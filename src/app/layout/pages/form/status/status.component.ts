import { Component, OnInit } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'phx-status',
	templateUrl: 'status.component.html'
})

export class StatusComponent implements OnInit {
	// STATUS
	public AnalystDraft: boolean;
	public AnalystReview: boolean;
	public MarketingDraft: boolean;
	public MarketingReview: boolean;
	public ChromatogramUpload: boolean;
	public WebApproval: boolean;
	public PHE: boolean;
	public Archive: boolean;

	// Send Button
	public OverviewDraft: boolean;
	public ColumnDetailsDraft: boolean;
	public InstrumentationDraft: boolean;
	public AnalyteDetailsDraft: boolean;
	public SamplePrepMethodDraft: boolean;
	public SendButton: boolean;
	public AnalystDraftList: boolean;

	constructor() {
		this.AnalystDraft = false;
		this.AnalystReview = false;
		this.MarketingDraft = false;
		this.MarketingReview = false;
		this.ChromatogramUpload = false;
		this.WebApproval = false;
		this.PHE = false;
		this.Archive = false;

		// When a section is completed, change flag
		this.OverviewDraft = false;
		this.ColumnDetailsDraft = false;
		this.InstrumentationDraft = false;
		this.AnalyteDetailsDraft = false;
		this.SamplePrepMethodDraft = false;
		this.SendButton = false;
		this.AnalystDraftList = false;
	}

	ngOnInit() {

	}

	// Determine to enable Send Button
	public CheckSendDraft() {
		if (this.OverviewDraft
			&& this.ColumnDetailsDraft
			&& this.InstrumentationDraft
			&& this.AnalyteDetailsDraft
			&& this.SamplePrepMethodDraft
		) {
			this.AnalystDraftList = true;
		}
	}
}
