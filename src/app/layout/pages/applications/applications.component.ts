import { Component, OnInit } from '@angular/core';

// KENDO UI
import { process, State, SortDescriptor, orderBy } from '@progress/kendo-data-query';

// SEO
import { Meta, Title } from '@angular/platform-browser';

import { IApplications, API, AuthenticationService } from '../../../core/index';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';

// COMPONENT
@Component({
	moduleId: module.id,
	selector: 'phx-applications',
	templateUrl: 'applications.component.html',
	providers: [API]
})

// CLASS
export class ApplicationsComponent implements OnInit {
	public disabled: boolean;

	public settings: Array<object> = [];
	public data: Array<IApplications> = [];

	public grid: GridDataResult;

	public sort: SortDescriptor[] = [{
		field: 'applicationID',
		dir: 'desc'
	}];

	public state: State = {
		skip: 0,
		sort: this.sort,
		take: 100,
		filter: {
			logic: 'and',
			filters: []
		}
	}

	constructor(meta: Meta, title: Title, private api: API, private AS: AuthenticationService) {
		title.setTitle('App Manager - Applications');
		this.userSettings();
		this.getApps();
	}

	ngOnInit() {

		// If no default value in Status input, set filter to empty array
		if (this.state.filter.filters.length !== 0 && this.state.filter.filters[0]['value'].length !== 0) {
			this.disabled = true;
			this.state.filter.filters = [];
		}
	}

	private loadProducts(): void {
		this.grid = process(this.data, this.state);
	}

	// API Call return { data: [{}] }, filter for [{}]
	public getApps(): void {

		if (this.state.filter.filters.length !== 0) {
			this.api.get('applications.json', 'applications', this.state)
				.subscribe(r => {
					this.data = r['data'];
					this.loadProducts()
				});
		} else {
			this.api.get('applications.json', 'applications')
				.subscribe(r => {
					this.data = r['data'];
					this.loadProducts()
				});
		}
	}

	public userSettings() {
		this.api.get('lookup-status.json', 'users/' + this.AS.getTokenDecoded()['sub'] + '/settings').subscribe(r => {

			if (r['ApplicationStatus']) {
				this.settings[0] = r['ApplicationStatus'];
				this.state.filter.filters.push({ field: 'status', operator: 'contains', value: this.settings[0] })
			}
			if (r['Reviewer']['Email']) {
				this.settings[1] = r['Reviewer']['Email'];
				this.state.filter.filters.push({ field: 'reviewer', operator: 'eq', value: this.settings[1] })
			}
			if (r['ApplicationType']) {
				this.settings[2] = r['ApplicationType'];
				this.state.filter.filters.push({ field: 'applicationType', operator: 'contains', value: this.settings[2] })
			}
		});
	}

	public clearFilter(): void {
		this.disabled = true;
		this.state.filter.filters = []; // Clear all filter input values
		this.loadProducts();
	}

	public dataStateChange(state: DataStateChangeEvent): void {
		this.state = state;
		this.loadProducts();
	}

	public filterChange() {
		if (this.state.filter.filters.length !== 0) {
			this.disabled = false;
		} else {
			this.disabled = true;
		}

		this.getApps();
	}

	public formatDate(a) {
		return new Date(a);
	}
}
