import { Component, OnInit } from '@angular/core';

// SEO
import { Meta, Title } from '@angular/platform-browser';

// INTERFACES
import { IUser, API, ILookup, AuthenticationService } from '../../../../core/index';
import { FormGroup, FormBuilder } from '@angular/forms';

interface ISetting {
	ID: string,
	Email: string
}

@Component({
	moduleId: module.id,
	selector: 'phx-settings',
	templateUrl: 'settings.component.html',
	providers: [API]
})

// CLASS
export class SettingsComponent implements OnInit {
	public Settings: FormGroup;
	public dataStatus: Array<ILookup> = [];
	public dataTechnique: Array<ILookup> = [];
	public dataReviewer: Array<object> = [];

	public selectedStatus = 0;
	public selectedTechnique = 0;
	public selectedReviewer: ISetting;


	// public userObj: ISettingStatus;

	constructor(
		meta: Meta,
		title: Title,
		private api: API,
		private AS: AuthenticationService,
		private fb: FormBuilder
	) {
		this.Settings = this.fb.group({
			ApplicationStatusKey: [''],
			ApplicationTypeKey: [''],
			Reviewer: ['']
		});
	}

	ngOnInit() {
		// Get Lookup
		this.api.get('lookup-ApplicationStatus.json', 'lookups/ApplicationStatus')
			.subscribe(r => {
				this.dataStatus = r;
			});

		this.api.get('lookup-ApplicationType.json', 'lookups/ApplicationType')
			.subscribe(r => {
				this.dataTechnique = r;
			});

		this.api.get('users-roles.json', 'users/roles')
			.subscribe(r => {
				let data: Array<object> = [];
				r.forEach(function (x) {
					data.push(x['User']);
				});
				this.dataReviewer = data;
			});

		// TODO: API generate error 500, if ApplicationTypeKey has value
		// Get Selected Dropdown List
		this.api.get('users-settings.json', 'users/' + this.AS.getTokenDecoded()['sub'] + '/settings')
			.subscribe(r => {
				if (Object.getOwnPropertyNames(r).length !== 0) {
					this.selectedStatus = r['ApplicationStatusKey'];
					this.selectedTechnique = r['ApplicationTypeKey'];
					this.selectedReviewer = r['Reviewers'];
				}
			});
	}

	public valueChangeStatus(val) {
		this.Settings.controls['ApplicationStatusKey'].setValue(val);
		this.post();
	}

	public valueChangeTechnique(val) {
		this.Settings.controls['ApplicationTypeKey'].setValue(val);
		this.post();
	}

	public valueChangeReviewer(val) {
		this.Settings.controls['Reviewer'].setValue(val);
		this.post();
	}

	public post() {
		this.api.post('users/' + this.AS.getTokenDecoded()['sub'] + '/settings', this.Settings.value)
			.subscribe();
	}
}
