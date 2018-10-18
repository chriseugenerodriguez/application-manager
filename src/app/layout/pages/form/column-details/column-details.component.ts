import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoCompleteComponent } from '@progress/kendo-angular-dropdowns';

import { API, ILookup, AuthenticationService, LookupService } from '../../../../core/index';
import { Observable } from 'rxjs/Observable';

@Component({
	moduleId: module.id,
	selector: 'phx-column-details',
	templateUrl: 'column-details.component.html'
})

export class ColumnDetailsComponent implements OnInit {

	// DONE
	@Output() done: EventEmitter<boolean> = new EventEmitter(false);
	finish: boolean = false;

	public permissions: Array<object>;

	// DISABLED
	public ColumnDetailsDisabled: boolean;

	public readonlyValue = true;
	public location: string;
	public appFormType: number;
	public isValidForm = false;
	public ColumnDetailsOpened: boolean;

	// REACTIVE FORM
	@Input('form') ColumnDetails: FormGroup;
	@Input('statusComponent') statusComponent: any;
	@Input() Opened: boolean;

	@ViewChild('autocomplete') public autocomplete: AutoCompleteComponent;

	// data for filterChange on combobox
	public dataPHECompetitor: Array<ILookup>;
	public dataPartNumber: Array<any>;
	public dataMfgCode: Array<ILookup>;
	public dataBrandCode: Array<ILookup>;

	// Array of objects
	public PHECompetitor: Array<ILookup>;
	public PartNumber: Array<any>;
	public GuardCartridge: Array<ILookup>;
	public GuardHolder: Array<ILookup>;
	public SyringeFilter: Array<ILookup>;
	public InletBaseSeal: Array<ILookup>;
	public InletLiner: Array<ILookup>;
	public GuardColumn: Array<ILookup>;
	public MfgCode: Array<ILookup>;
	public BrandCode: Array<ILookup>;

	// Value of Dropdown List instead of Key-Value
	public pheCompetitorKey: number;
	public partNumberKey: number;
	public inletBaseSealKey: number;
	public inletLinerKey: number;
	public guardCartridgeKey: number;
	public guardColumnKey: number;
	public guardHolderKey: number;
	public syringeFilterKey: number;
	public mfgCodeKey: number;
	public brandCodeKey: number;

	public pheCompetitorValue: string;
	public mfgCodeValue: string;
	public brandCodeValue: string;

	// Constructor
	constructor(
		private fb: FormBuilder,
		private api: API,
		private router: Router,
		private route: ActivatedRoute,
		private AS: AuthenticationService,
		private lookupService: LookupService
	) {
		// SHOW / HIDE INPUTS ON URL
		this.location = router.url;

		// 1 = LC, 2 = GC
		if (this.location.indexOf('form-lc') !== -1) {
			this.appFormType = 1;
		} else {
			this.appFormType = 2;
		}
	}

	// Initialize
	ngOnInit() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.loadData().subscribe((r) => {
				this.PHECompetitor = r[0];
				this.dataPHECompetitor = r[0].slice();

				this.BrandCode = r[1];
				this.dataBrandCode = r[1].slice();

				if (Object.getOwnPropertyNames(r[2]).length !== 0 && r[2]['ColumnDetails'].PhenomenexOrCompetitorColumnKey !== null) {

					if (this.pheCompetitorValue) {
						this.ColumnDetails.controls['PhenomenexOrCompetitorColumnKey'].setValue(r[2]['ColumnDetails'].PhenomenexOrCompetitorColumnKey);
						this.pheCompetitorValue = this.lookupService.lookupKeyValue(this.PHECompetitor, r[2]['ColumnDetails'].PhenomenexOrCompetitorColumnKey);
					}

					this.partNumberKey = r[2]['ColumnDetails'].PartNumberKey;

					// Switch layout, enabled, disabled, clear fields
					this.valueChangePHECompetitor(r[2]['ColumnDetails'].PhenomenexOrCompetitorColumnKey);

					this.api.get('lookup-mfg.json', 'lookups/MfgCode/' + r[2]['ColumnDetails'].PhenomenexOrCompetitorColumnKey).subscribe(m => {
							this.MfgCode = m;
							this.dataMfgCode = m.slice();

							if (r[2]['ColumnDetails'].PhenomenexOrCompetitorColumnKey === 1) {
								this.mfgCodeValue = this.lookupService.lookupKeyValue(this.MfgCode, r[2]['ColumnDetails'].Part.MfgCodeKey);
							} else {
								this.mfgCodeValue = this.lookupService.lookupKeyValue(this.MfgCode, r[2]['ColumnDetails'].MfgCodeKey);
								// console.log('MfgCode', r['ColumnDetails'].Part.MfgCodeKey, this.mfgCodeValue);
							}
					})

					// Both GC & LC Forms
					this.ColumnDetails.controls['PartNumber'].setValue(r[2]['ColumnDetails'].PartNumber);

					// Phenomenex Column
					if (r[2]['ColumnDetails'].PhenomenexOrCompetitorColumnKey === 1) {
						// console.log('phx column');

						this.ColumnDetails.controls['PartNumber'].setValue(r[2]['ColumnDetails'].PartNumber);
						this.ColumnDetails.controls['PartNumberKey'].setValue(r[2]['ColumnDetails'].PartNumberKey);

						this.ColumnDetails.controls['BrandCodeKey'].setValue(r[2]['ColumnDetails'].Part.BrandCodeKey);
						this.ColumnDetails.controls['BrandCode'].setValue(r[2]['ColumnDetails'].Part.BrandCode);
						this.brandCodeValue = r[2]['ColumnDetails'].Part.BrandCode;
						this.ColumnDetails.controls['MfgCodeKey'].setValue(r[2]['ColumnDetails'].Part.MfgCodeKey);
						this.ColumnDetails.controls['MfgCode'].setValue(r[2]['ColumnDetails'].Part.MfgCode);
						this.mfgCodeValue = r[2]['ColumnDetails'].Part.MfgCode;

						if (this.partNumberKey !== null) {
							this.api.get('lookup-part-number.json', 'applications/partnumber/' + this.partNumberKey)
							.subscribe(retPart => {
								this.changePartNumber(retPart, true);
							})
						}

					// Competitor Column
					} else {
						// console.log('competitor column');
						this.ColumnDetails.controls['PartNumber'].setValue(r[2]['ColumnDetails'].PartNumber);
						this.ColumnDetails.controls['CommercialDescription'].setValue(r[2]['ColumnDetails'].CommercialDescription);
						this.mfgCodeKey = r[2]['ColumnDetails'].MfgCodeKey;
						this.brandCodeKey = r[2]['ColumnDetails'].BrandCodeKey;
						this.brandCodeValue = this.lookupService.lookupKeyValue(this.BrandCode, this.brandCodeKey);
						this.ColumnDetails.controls['Length'].setValue(r[2]['ColumnDetails'].Length);
						this.ColumnDetails.controls['InternalDiameter'].setValue(r[2]['ColumnDetails'].InternalDiameter);

						if (this.location.indexOf('form-lc') !== -1) {
							this.ColumnDetails.controls['ParticleSize'].setValue(r[2]['ColumnDetails'].ParticleSize);
							this.ColumnDetails.controls['PoreSize'].setValue(r[2]['ColumnDetails'].PoreSize);
						} else {
							this.ColumnDetails.controls['FilmThickness'].setValue(r[2]['ColumnDetails'].FilmThickness);
						}
					}

					this.ColumnDetails.controls['SerialNumber'].setValue(r[2]['ColumnDetails'].SerialNumber);
					this.ColumnDetails.controls['BatchNumber'].setValue(r[2]['ColumnDetails'].BatchNumber);
					this.ColumnDetails.controls['ColumnEfficiency'].setValue(r[2]['ColumnDetails'].ColumnEfficiency);
					this.ColumnDetails.controls['SyringeFilter'].setValue(r[2]['ColumnDetails'].SyringeFilter);
					this.ColumnDetails.controls['SyringeFilterKey'].setValue(r[2]['ColumnDetails'].SyringeFilterKey);

					if (this.location.indexOf('form-lc') !== -1) {
						this.ColumnDetails.controls['PeakCapacity'].setValue(r[2]['ColumnDetails'].PeakCapacity);
						this.ColumnDetails.controls['GuardCartridge'].setValue(r[2]['ColumnDetails'].GuardCartridge);
						this.ColumnDetails.controls['GuardCartridgeKey'].setValue(r[2]['ColumnDetails'].GuardCartridgeKey);
						this.ColumnDetails.controls['GuardHolder'].setValue(r[2]['ColumnDetails'].GuardHolder);
						this.ColumnDetails.controls['GuardHolderKey'].setValue(r[2]['ColumnDetails'].GuardHolderKey);
					} else {
						this.ColumnDetails.controls['InletBaseSeal'].setValue(r[2]['ColumnDetails'].InletBaseSeal);
						this.ColumnDetails.controls['InletBaseSealKey'].setValue(r[2]['ColumnDetails'].InletBaseSealKey);
						this.ColumnDetails.controls['InletLiner'].setValue(r[2]['ColumnDetails'].InletLiner);
						this.ColumnDetails.controls['InletLinerKey'].setValue(r[2]['ColumnDetails'].InletLinerKey);
						this.ColumnDetails.controls['GuardColumn'].setValue(r[2]['ColumnDetails'].GuardColumn);
						this.ColumnDetails.controls['GuardColumnKey'].setValue(r[2]['ColumnDetails'].GuardColumnKey);
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

	public permission() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.api.get('user-role-assigned-to.json', 'users/' + this.AS.getTokenDecoded()['sub']).subscribe(r => {
				this.permissions = r;

				for (let x = 0; x < this.permissions['Roles'].length; x++) {
					let c = this.permissions['Roles'][x].ColumnDetails;

					if (!this.statusComponent.PHE) {
						if ( c.Read === false && c.Write === false ) {
							this.ColumnDetailsDisabled = true;
							this.ColumnDetailsOpened = false;
						}
						if ( c.Read === true && c.Write === false ) {
							this.ColumnDetails.disable();
						}
						if ( c.Read === false && c.Write === true || c.Read === true && c.Write === true) {
							this.ColumnDetails.enable();
						}
					}
				}

				let b;
				for (let x = 0; x < this.permissions.length; x++) {
					if (x['Admin']) {
						b = x['Admin'];
					}
					if (b === true) {
						this.ColumnDetails.enable();
					} else {
						this.ColumnDetails.disable();
					}
				}

				this.done.emit(true);
				this.finish = true;
			})
		}
	}

	loadData(): Observable<any[]> {
		let r0 = this.api.get('lookup-phe-competitor.json', 'lookups/PhenomenexOrCompetitorColumn');
		let r1 = this.api.get('lookup-brand.json', 'lookups/BrandCode');
		let r2 = this.api.get('application.json', 'applications/' + this.route.snapshot.params.id);

		return Observable.forkJoin([r0, r1, r2])
	}

	// Populate Part Description
	private changePartNumber(partObj, onLoad) {
		this.ColumnDetails.controls['Description1'].setValue(partObj.Description1);
		this.ColumnDetails.controls['Description2'].setValue(partObj.Description2);
		this.ColumnDetails.controls['Length'].setValue(partObj.Length);
		this.ColumnDetails.controls['InternalDiameter'].setValue(partObj.InternalDiameter);

		if (this.location.indexOf('form-lc') !== -1) {
			this.ColumnDetails.controls['ParticleSize'].setValue(partObj.ParticleSize);
			this.ColumnDetails.controls['PoreSize'].setValue(partObj.PoreSize);
		} else {
			this.ColumnDetails.controls['FilmThickness'].setValue(partObj.FilmThickness);
		}

		if (onLoad === false) {
			// Lookup Mfg Code
			if (partObj.MfgCodeKey !== 0) {
				this.mfgCodeValue = this.lookupService.lookupKeyValue(this.MfgCode, partObj.MfgCodeKey);
				this.ColumnDetails.controls['MfgCode'].setValue(this.mfgCodeValue);
				this.ColumnDetails.controls['MfgCodeKey'].setValue(partObj.MfgCodeKey);
			} else {
				this.ColumnDetails.controls['MfgCode'].setValue('');
				this.ColumnDetails.controls['MfgCodeKey'].setValue('');
			}

			// Lookup Brand Code
			if (partObj.BrandCodeKey !== 0) {
				this.brandCodeValue = this.lookupService.lookupKeyValue(this.BrandCode, partObj.BrandCodeKey);
				this.ColumnDetails.controls['BrandCode'].setValue(this.brandCodeValue);
				this.ColumnDetails.controls['BrandCodeKey'].setValue(partObj.BrandCodeKey);
			} else {
				this.ColumnDetails.controls['BrandCode'].setValue('');
				this.ColumnDetails.controls['BrandCodeKey'].setValue('');
			}
		}
	}

	// Enable, Disable, Clear Fields
	public valueChangePHECompetitor(pheCompKey) {
		this.pheCompetitorKey = pheCompKey;

		if (typeof(pheCompKey) !== 'undefined') {
			// lookupKeyValue for mfgCode need to be inside the looks/MfgCode to prevent missing objects in kendo-combobox
			this.api.get('lookup-mfg.json', 'lookups/MfgCode/' + this.pheCompetitorKey)
				.subscribe(r => {
					this.MfgCode = r;
					this.dataMfgCode = r.slice();

					if ((this.location.indexOf('form-gc') !== -1 && (pheCompKey === 2)) || pheCompKey === 3) {
						this.mfgCodeValue = this.lookupService.lookupKeyValue(this.MfgCode, this.ColumnDetails.controls['MfgCodeKey'].value);
					}
				})

			if (this.location.indexOf('form-lc') !== -1) {
				if (pheCompKey === 1) {
					this.ColumnDetails.controls['Description1'].disable();
					this.ColumnDetails.controls['Description2'].disable();
					this.ColumnDetails.controls['MfgCode'].disable();
					this.ColumnDetails.controls['BrandCode'].disable();
					this.ColumnDetails.controls['Length'].disable();
					this.ColumnDetails.controls['InternalDiameter'].disable();
					this.ColumnDetails.controls['ParticleSize'].disable();
					this.ColumnDetails.controls['PoreSize'].disable();
				} else {
					this.ColumnDetails.controls['Length'].enable();
					this.ColumnDetails.controls['InternalDiameter'].enable();
					this.ColumnDetails.controls['ParticleSize'].enable();
					this.ColumnDetails.controls['PoreSize'].enable();
					this.ColumnDetails.controls['MfgCode'].enable();
					this.ColumnDetails.controls['BrandCode'].enable();
				}

				// Clear all input fields
				this.ColumnDetails.controls['ParticleSize'].setValue('');
				this.ColumnDetails.controls['PoreSize'].setValue('');
				this.ColumnDetails.controls['Length'].setValue('');

			} else if (this.location.indexOf('form-gc') !== -1) {
				if (pheCompKey === 1) {
					this.ColumnDetails.controls['Description1'].disable();
					this.ColumnDetails.controls['Description2'].disable();
					this.ColumnDetails.controls['MfgCode'].disable();
					this.ColumnDetails.controls['BrandCode'].disable();
					this.ColumnDetails.controls['Length'].disable();
					this.ColumnDetails.controls['InternalDiameter'].disable();
					this.ColumnDetails.controls['FilmThickness'].disable();
				} else {
					this.ColumnDetails.controls['MfgCode'].enable();
					this.ColumnDetails.controls['MfgCodeKey'].enable();
					this.ColumnDetails.controls['BrandCode'].enable();
					this.ColumnDetails.controls['Length'].enable();
					this.ColumnDetails.controls['InternalDiameter'].enable();
					this.ColumnDetails.controls['FilmThickness'].enable();
				}

				// Clear all input fields
				this.ColumnDetails.controls['Length'].setValue('');
				this.ColumnDetails.controls['FilmThickness'].setValue('');
			}

			// Clear all input fields
			this.ColumnDetails.controls['PartNumber'].setValue('');
			this.ColumnDetails.controls['Description1'].setValue('');
			this.ColumnDetails.controls['Description2'].setValue('');
			this.ColumnDetails.controls['MfgCode'].setValue('');
			this.ColumnDetails.controls['MfgCodeKey'].setValue('');
			this.ColumnDetails.controls['BrandCode'].setValue('');
			this.ColumnDetails.controls['BrandCodeKey'].setValue('');
			this.ColumnDetails.controls['InternalDiameter'].setValue('');
		}
	}

	// Filter PHE or Competitor
	public filterChangePHECompetitor(val) {
		this.dataPHECompetitor = this.PHECompetitor.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	private filterChangePartNumber(val) {
		if (val.length >= 3) {
			this.api.get('lookup-part-number.json', 'lookups-search/PartNumber/' + val + '')
			.subscribe(r => {
				this.PartNumber = r;
			})
		} else {
			this.autocomplete.toggle(false);
		}
	}

	private selectPart(event) {
		this.partNumberKey = this.lookupService.lookupKey(this.PartNumber, event.target.value.toUpperCase());
		this.ColumnDetails.controls['PartNumberKey'].setValue(this.partNumberKey);
		this.callpartNumber(this.partNumberKey);
	}

	private valueChangePartNumber(val) {
		if (val) {
			this.partNumberKey = this.lookupService.lookupKey (this.PartNumber, val);
		}

		if (this.partNumberKey) {
			this.ColumnDetails.controls['PartNumberKey'].setValue(this.partNumberKey);
			this.callpartNumber(this.partNumberKey);
		}
	}

	private callpartNumber(i) {
		this.api.get('lookup-part-number.json', 'applications/partnumber/' + i)
		.subscribe(r => {
			this.dataPartNumber = r;
			this.changePartNumber(r, false);
		})
	}

	public filterChangeGuardCartridge(val) {
		if (val.length >= 3) {
			this.api.get('lookup-guard-cartridge.json', 'lookups-search/GuardCartridge/' + val + '')
			.subscribe(r => {
				this.GuardCartridge = r;
			})
		} else {
			this.autocomplete.toggle(false);
		}
	}

	public valueChangeGuardCartridge(val) {
		this.guardCartridgeKey = this.lookupService.lookupKey (this.GuardCartridge, val);
		this.ColumnDetails.controls['GuardCartridgeKey'].setValue(this.guardCartridgeKey);
	}

	public filterChangeGuardHolder(val) {
		if (val.length >= 3) {
			this.api.get('lookup-guard-holder.json', 'lookups-search/GuardHolder/' + val + '')
			.subscribe(r => {
				this.GuardHolder = r;
			})
		} else {
			this.autocomplete.toggle(false);
		}
	}

	public valueChangeGuardHolder(val) {
		this.guardHolderKey = this.lookupService.lookupKey (this.GuardHolder, val);
		this.ColumnDetails.controls['GuardHolderKey'].setValue(this.guardHolderKey);
	}

	public filterChangeSyringeFilter(val) {
		if (val.length >= 3) {
			this.api.get('lookup-Syringe-Filter.json', 'lookups-search/SyringeFilter/' + val + '')
			.subscribe(r => {
				this.SyringeFilter = r;
			})
		} else {
			this.autocomplete.toggle(false);
		}
	}

	public valueChangeSyringeFilter(val) {
		this.syringeFilterKey = this.lookupService.lookupKey (this.SyringeFilter, val);
		this.ColumnDetails.controls['SyringeFilterKey'].setValue(this.syringeFilterKey);
	}

	public filterChangeMfgCode(val) {
		this.dataMfgCode = this.MfgCode.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeBrandCode(val) {
		this.dataBrandCode = this.BrandCode.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeInletBaseSeal(val) {
		if (val.length >= 3) {
			this.api.get('lookup-Inlet-Base-Seal.json', 'lookups-search/InletBaseSeal/' + val + '')
			.subscribe(r => {
				this.InletBaseSeal = r;
			})
		} else {
			this.autocomplete.toggle(false);
		}
	}

	public valueChangeInletBaseSeal(val) {
		this.inletBaseSealKey = this.lookupService.lookupKey (this.InletBaseSeal, val);
		this.ColumnDetails.controls['InletBaseSealKey'].setValue(this.inletBaseSealKey);
	}

	public filterChangeInletLiner(val) {
		if (val.length >= 3) {
			this.api.get('lookup-inlet-liner.json', 'lookups-search/InletLiner/' + val + '')
			.subscribe(r => {
				this.InletLiner = r;
			})
		} else {
			this.autocomplete.toggle(false);
		}
	}

	public valueChangeInletLiner(val) {
		this.inletLinerKey = this.lookupService.lookupKey (this.InletLiner, val);
		this.ColumnDetails.controls['InletLinerKey'].setValue(this.inletLinerKey);
	}

	public filterChangeGuardColumn(val) {
		if (val.length >= 3) {
			this.api.get('lookup-guard-column.json', 'lookups-search/GuardColumn/' + val + '')
			.subscribe(r => {
				this.GuardColumn = r;
			})
		} else {
			this.autocomplete.toggle(false);
		}
	}

	public valueChangeGuardColumn(val) {
		this.guardColumnKey = this.lookupService.lookupKey (this.GuardColumn, val);
		this.ColumnDetails.controls['GuardColumnKey'].setValue(this.guardColumnKey);
	}
}
