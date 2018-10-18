import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { API, ISamplePreps, AuthenticationService } from '../../../../core/index';
import { CreateSamplePrepComponent } from '../../sample-prep/create/create.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
	moduleId: module.id,
	selector: 'phx-sample-preparation-methodology',
	templateUrl: 'sample-preparation-methodology.component.html'
})

export class SamplePreparationMethodologyComponent implements OnInit {

	// DONE
	@Output() done: EventEmitter<boolean> = new EventEmitter(false);
	finish: boolean = false;

	public permissions: Array<object>;

	// ACCORDION
	@Input() Opened: boolean;
	public SamplePreparationOpened: boolean;

	// DISABLED
	public SamplePreparationDisabled: boolean;

	public samplePrepMethodKey: string;

	public samplePrepUrl: string;
	public samplePreparationValue: string;
	public appID: number;
	public appForm: string;
	public location: string;
	public routeLink: string;

	public save: boolean;

	// DISABLED
	public disabled = false;

	// REACTIVE FORM
	@Input('statusComponent') statusComponent: any;
	@Input('form') SamplePrepMethod: FormGroup;
	@Input('applicationForm') applicationForm: FormGroup;
	public dataSamplePreps: Array<ISamplePreps> = [];
	public source: Array<ISamplePreps> = [];

	constructor(
		private fb: FormBuilder,
		private api: API,
		private router: Router,
		private route: ActivatedRoute,
		private AS: AuthenticationService
	) {
		// SHOW / HIDE INPUTS ON URL
		this.location = router.url;

		if (this.location.indexOf('form-lc') !== -1) {
			this.appForm = 'form-lc';
		} else {
			this.appForm = 'form-gc';
		}

		this.appID = this.route.snapshot.params.id;

		if (typeof (this.route.snapshot.params.id) === 'undefined') {
			this.routeLink = '/0/' + this.appForm;
		} else {
			this.routeLink = '/' + this.appID + '/' + this.appForm;
		}
	}

	ngOnInit() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.loadData().subscribe(r => {
				if (Object.getOwnPropertyNames(r[0]).length !== 0) {
					this.source = r[0]['data'];
					this.dataSamplePreps = this.source.slice();
				}

				if (Object.getOwnPropertyNames(r[1]).length !== 0 && r[1]['SamplePrepMethod'] !== null) {
					this.SamplePrepMethod.controls['ID'].setValue(r[1]['SamplePrepMethod'].ID);

					for (const record of this.source) {
						if (Number(record['samplePrepID']) === r[1]['SamplePrepMethod'].ID) {
							this.samplePrepMethodKey = record['samplePrepID'];

							for (const s of this.source) {
								if (Number(s['samplePrepID']) === r[1]['SamplePrepMethod'].ID) {
									this.samplePreparationValue = s['samplePrepTitle'];
									break;
								}
							}
						}
					}
				}

				this.AS.isLoggedIn().subscribe(loggedin => {
					if (loggedin) {
						this.permission();
					}
				});
			});
		}
	}

	loadData(): Observable<any> {
		let r0 = this.api.get('sample-preps-list.json', 'sample-preps');
		let r1 = this.api.get('application.json', 'applications/' + this.route.snapshot.params.id)

		return Observable.forkJoin([r0, r1]);
	}

	public handleFilter(value) {
		this.dataSamplePreps = this.source.filter((s) => s.samplePrepTitle.toLowerCase().indexOf(value.toLowerCase()) !== -1);
	}

	public createSamplePrep() {
		this.save = true;

		let link = '/sample-preps/create' + this.routeLink;
		this.api.put('applications', this.applicationForm.value)
			.subscribe(
				r => {
					this.router.navigate([link])
				}
			);

		return false;
	}

	public permission() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.api.get('user-role-assigned-to.json', 'users/' + this.AS.getTokenDecoded()['sub']).subscribe(r => {
				this.permissions = r;

				for (let x = 0; x < this.permissions['Roles'].length; x++) {
					let c = this.permissions['Roles'][x].SamplePrepMethod;
					let b = this.permissions['Roles'][x].Admin;

					if (!this.statusComponent.PHE) {
						if (c.Read === false && c.Write === false) {
							this.SamplePreparationDisabled = true;
							this.SamplePreparationOpened = false;
						}
						if (c.Read === true && c.Write === false) {
							this.SamplePrepMethod.disable();
							this.disabled = true;
						}
						if (c.Read === false && c.Write === true || c.Read === true && c.Write === true) {
							this.SamplePrepMethod.enable();
							this.disabled = false;
						}
					} else {
						if (b === true) {
							this.SamplePrepMethod.enable();
							this.disabled = false;
						} else {
							this.SamplePrepMethod.disable();
							this.disabled = true;
						}
					}
				}

				this.done.emit(true);
				this.finish = true;
			})
		}
	}

}
