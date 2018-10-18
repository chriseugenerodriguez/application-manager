import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { API, ILookup, AuthenticationService, LookupService } from '../../../../core/index';
import { Observable } from 'rxjs';

@Component({
	moduleId: module.id,
	selector: 'phx-coding-related-terms',
	templateUrl: 'coding-related-terms.component.html'
})

export class CodingRelatedTermsComponent implements OnInit {

	// DONE
	@Output() done: EventEmitter<boolean> = new EventEmitter(false);
	finish: boolean = false;

	public permissions: Array<object>;

	// Combobox Filter
	public dataCompoundCluster: Array<ILookup>;
	public dataIndustry: Array<ILookup>;

	// Array of objects
	public CompoundCluster: Array<ILookup>;
	public Industry: Array<ILookup>;

	// Value of Dropdown List instead of Key-Value
	public industryKey: Array<number> = [];
	public compoundClusterKey: Array<number> = [];

	public industryValue: string;
	public compoundClusterValue: string;
	public relatedTermValue: string;

	public RT = [];
	public RelatedTerm: string;

	public activateButton = false;
	public isValidForm = false;

	// REACTIVE FORM
	@Input('form') CodingRelatedTerms: FormGroup;
	@Input('statusComponent') statusComponent: any;

	// ACCORDION
	@Input() Opened: boolean;
	CodingRelatedTermsOpened: boolean;

	// DISABLED
	CodingRelatedTermsDisabled: boolean;

	constructor(
		private _router: Router,
		private api: API,
		private route: ActivatedRoute,
		private AS: AuthenticationService,
		private lookupService: LookupService
	) {
	}

	ngOnInit() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.loadData().subscribe(r => {
				this.Industry = r[0];
				this.dataIndustry = r[0];

				this.CompoundCluster = r[1];
				this.dataCompoundCluster = r[1];

				if (Object.getOwnPropertyNames(r).length !== 0) {

					this.CodingRelatedTerms.controls['CreativeJobNumbers'].setValue(r[2]['CodingRelatedTerms'].CreativeJobNumbers);

					this.CodingRelatedTerms.controls['IndustryKey'].setValue(r[2]['CodingRelatedTerms'].IndustryKey);
					this.industryKey = r[2]['CodingRelatedTerms'].IndustryKey;
					let postIndustryValue = [];
					for (let i of this.industryKey) {
						postIndustryValue.push(this.lookupService.lookupKeyValue(this.Industry, i));
					}
					this.industryValue = postIndustryValue.join();

					this.CodingRelatedTerms.controls['CompoundKey'].setValue(r[2]['CodingRelatedTerms'].CompoundKey);
					this.compoundClusterKey = r[2]['CodingRelatedTerms'].CompoundKey;
					let postCompoundValue = [];
					for (let c of this.compoundClusterKey) {
						postCompoundValue.push(this.lookupService.lookupKeyValue(this.CompoundCluster, c));
					}
					this.compoundClusterValue = postCompoundValue.join();

					this.CodingRelatedTerms.controls['RelatedTerms'].setValue(r[2]['CodingRelatedTerms'].RelatedTerms);
					this.RT = r[2]['CodingRelatedTerms'].RelatedTerms;
					this.relatedTermValue = this.RT.join();
				}

				this.AS.isLoggedIn().subscribe(loggedin => {
					if (loggedin) {
						this.permission();
					}
				});
			})
		}
	}

	loadData(): Observable<any> {
		let r0 = this.api.get('lookup-industry.json', 'lookups/Industry');
		let r1 = this.api.get('lookup-compound-cluster.json', 'lookups/CompoundCluster');
		let r2 = this.api.get('application.json', 'applications/' + this.route.snapshot.params.id);

		return Observable.forkJoin([r0, r1, r2]);
	}

	public enabledButton(input) {
		if (input === '') {
			this.activateButton = false;
		} else {
			this.activateButton = true;
		}
	}

	public addRelatedTerm() {
		let relatedTerms = this.RelatedTerm;
		this.RT.push(relatedTerms);
		this.CodingRelatedTerms.controls['RelatedTerms'].setValue(this.RT);

		this.RelatedTerm = '';
		return false;
	}

	removeRelatedTerm(RelatedTerm) {
		const index = this.RT.indexOf(RelatedTerm);
		this.RT.splice(index, 1);
	}

	formatRelatedTerm(event) {
		let k;
		k = event.charCode;  //         k = event.keyCode;  (Both can be used)
		return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k > 46 && k < 58) || k === 8);
	}

	public permission() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.api.get('user-role-assigned-to.json', 'users/' + this.AS.getTokenDecoded()['sub']).subscribe(r => {
				this.permissions = r;

				for (let x = 0; x < this.permissions['Roles'].length; x++) {
					let c = this.permissions['Roles'][x].CodingRelatedTerms;

					if (!this.statusComponent.PHE) {
						if (c.Read === false && c.Write === false) {
							this.CodingRelatedTermsDisabled = true;
							this.CodingRelatedTermsOpened = false;
						}
						if (c.Read === true && c.Write === false) {
							this.CodingRelatedTerms.disable();
						}
						if (c.Read === false && c.Write === true || c.Read === true && c.Write === true) {
							this.CodingRelatedTerms.enable();
						}
					}
				}

				let b;
				for (let x = 0; x < this.permissions.length; x++) {
					if (x['Admin']) {
						b = x['Admin'];
					}
					if (b === true) {
						this.CodingRelatedTerms.enable();
					} else {
						this.CodingRelatedTerms.disable();
					}
				}

				this.done.emit(true);
				this.finish = true;
			})
		}
	}

	public filterIndustry(val) {
		this.dataIndustry = this.Industry.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterCompoundCluster(val) {
		this.dataCompoundCluster = this.CompoundCluster.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}
}
