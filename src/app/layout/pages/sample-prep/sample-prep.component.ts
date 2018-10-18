import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { process, State, filterBy, SortDescriptor } from '@progress/kendo-data-query';
import { DatePipe } from '@angular/common';

// REACTIVE FORM, API
import { ISamplePreps, API} from '../../../core/index';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';

@Component({
	moduleId: module.id,
	selector: 'phx-sample-prep',
	templateUrl: 'sample-prep.component.html',
	providers: [API]
})

export class SamplePrepComponent implements OnInit {
	public data: Array<ISamplePreps> = [];
	public disabledButtonClear = false;
	public sort: SortDescriptor[] = [{
		field: 'samplePrepID',
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
	};

	constructor(meta: Meta, title: Title, private api: API) {
			title.setTitle('App Manager - Sample Preps');

			this.getLocalSamplePreps();
	}

	public gridData: GridDataResult = process(this.data, this.state);

	ngOnInit() {
		this.disabledButtonClear = true;
	}

	private loadProducts(): void {
		this.gridData = process(this.data, this.state)
	}

	public formatDate(a) {
		return new Date(a);
	}

	public filterChange(): void {
		if (this.state.filter.filters.length !== 0) {
			this.disabledButtonClear = false;
		} else {
			this.disabledButtonClear = true;
		}

		this.getLocalSamplePreps();
	}

	public dataStateChange(state: DataStateChangeEvent): void {
		this.state = state;
		this.loadProducts();
	}

	public getLocalSamplePreps() {
		if (this.state.filter.filters.length !== 0) {
			this.api.get('sample-preps-list.json', 'sample-preps', this.state)
				.subscribe(r => {
					this.data = r['data'];
					this.loadProducts();
				});
		} else {
			this.api.get('sample-preps-list.json', 'sample-preps')
				.subscribe(r => {
					this.data = r['data'];
					this.loadProducts();
				});
		}

	}

	public clearFilter(): void {
		this.disabledButtonClear = true;
		this.state.filter.filters = []; // Clear all filter input values
		this.getLocalSamplePreps();
		this.loadProducts();
	}
}
