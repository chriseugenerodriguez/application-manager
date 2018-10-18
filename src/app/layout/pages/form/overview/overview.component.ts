import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { API, ILookup, AuthenticationService, LookupService } from '../../../../core/index';
import { Observable } from 'rxjs/Observable';

@Component({
	moduleId: module.id,
	selector: 'phx-overview',
	templateUrl: 'overview.component.html',

})

export class OverviewComponent implements OnInit {

	// DONE
	@Output() done: EventEmitter<boolean> = new EventEmitter(false);
	finish: boolean = false;

	@Input() Opened: boolean;
	@Input('form') Overview: FormGroup;
	@Input('statusComponent') statusComponent: any;

	public overviewOpened: boolean;
	public overviewDisabled: boolean;

	public applicationReason: string;
	public customerThirdPartyDetails: string;
	public appFormType: number;
	public location: string;
	public permissions: Array<object> = [];
	public isValidForm = false;

	public separationModeValue: string;
	public separationModeKey: number;
	public SeparationMode: Array<ILookup>;
	public dataSeparationMode: Array<ILookup>;

	constructor(
		private api: API,
		private route: ActivatedRoute,
		private _router: Router,
		private AS: AuthenticationService,
		private lookupService: LookupService
	) {

		// SHOW / HIDE INPUTS ON URL
		this.location = _router.url;

		// 1 = LC, 2 = GC
		if (this.location.indexOf('form-lc') !== -1) {
			this.appFormType = 1;
		} else {
			this.appFormType = 2;
		}
	}

	ngOnInit() {

		this.loadData().subscribe(r => {
			this.SeparationMode = r[0];
			this.dataSeparationMode = r[0].slice();

			if (typeof this.route.snapshot.params.id !== 'undefined') {

				if (Object.getOwnPropertyNames(r[1]).length !== 0) {
					this.Overview.controls['ApplicationTitle'].setValue(r[1]['Overview'].ApplicationTitle);
					this.Overview.controls['ApplicationReason'].setValue(r[1]['Overview'].ApplicationReason);
					this.Overview.controls['CustomerThirdPartyDetails'].setValue(r[1]['Overview'].CustomerThirdPartyDetails);

					this.Overview.controls['SeparationModeKey'].setValue(r[1]['Overview'].SeparationModeKey);
					this.separationModeKey = r[1]['Overview'].SeparationModeKey;
					if (this.separationModeValue) {
						this.separationModeValue = this.lookupService.lookupKeyValue(this.SeparationMode, r[1]['Overview'].SeparationModeKey);
					}
				}

				this.done.emit(true);
				this.finish = true;
			} else {
				this.finish = true;
			}
		});

		this.AS.isLoggedIn().subscribe(loggedin => {
			if (loggedin) {
				this.permission();
			}
		});
	}

	loadData(): Observable<any> {
		let r0 = this.api.get('lookup-separation-mode-' + this.appFormType + '.json', 'lookups/SeparationMode/' + this.appFormType)

		if (typeof this.route.snapshot.params.id !== 'undefined') {
		let r1 = this.api.get('application.json', 'applications/' + this.route.snapshot.params.id)
			return Observable.forkJoin([r0, r1]);
		} else {
			return Observable.forkJoin([r0]);
		}
	}

	public permission() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.api.get('user-role-assigned-to.json', 'users/' + this.AS.getTokenDecoded()['sub']).subscribe(r => {
				this.permissions = r;

				for (let x = 0; x < this.permissions['Roles'].length; x++) {
					let c = this.permissions['Roles'][x].Overview;

					if (!this.statusComponent.PHE) {
						if (c.Read === false && c.Write === false) {
							this.overviewDisabled = true;
							this.overviewOpened = false;
						}
						if (c.Read === true && c.Write === false) {
							this.Overview.disable();
						}
						if (c.Read === false && c.Write === true || c.Read === true && c.Write === true) {
							this.Overview.enable();
						}
					}
				}

				let b;
				for (let x = 0; x < this.permissions.length; x++) {
					if (x['Admin']) {
						b = x['Admin'];
					}

					if (this.statusComponent.PHE) {
						if (b === true) {
							this.Overview.enable();
						} else {
							this.Overview.disable();
						}
					}
				}

				this.done.emit(true);
				this.finish = true;
			})
		}
	}

	public filterSeparationMode(val) {
		this.dataSeparationMode = this.SeparationMode.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}
}
