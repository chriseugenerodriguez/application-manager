import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LookupService } from '../../../../core/index';

import { Subscription } from 'rxjs/Subscription';

// SEO **
import { Meta, Title } from '@angular/platform-browser';

// KENDO UI
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { AutoCompleteComponent } from '@progress/kendo-angular-dropdowns';
import { process, State, filterBy } from '@progress/kendo-data-query';

import { API, ILookup } from '../../../../core/index';

@Component({
	moduleId: module.id,
	selector: 'phx-sample-pre-create',
	templateUrl: 'create.component.html'
})
export class CreateSamplePrepComponent implements OnInit, OnDestroy {
	@ViewChild('autocomplete') public autocomplete: AutoCompleteComponent;

	private stepGrid: Array<object>;
	private gridData: any[];

	//private appID: string;
	//private appForm: string;
	private sub: Subscription;

	// REACTIVE FORM
	public samplePrepForm: FormGroup;

	// EDIT
	public view: boolean;
	public cloneButton: boolean;
	public stepControl: any;
	public showAppGrid: boolean;

	// VIEW RELATED APPS
	public viewrelated: boolean;
	public seerelated: boolean;

	public samplePrepID: string;
	public analyst: string;
	public createdOn: string;
	public modifiedOn: string;
	public cancelLink: string;
	public disabledButtonClear: boolean;

	// data for filterChange on combobox
	public dataSamplePrepTechnique: Array<ILookup>;
	public dataPHECompetitor: Array<ILookup>;
	public dataPartNumber: Array<any>;
	public dataMfgCode: Array<ILookup>;
	public dataBrandCode: Array<ILookup>;
	public dataSampleStepType: Array<ILookup>;
	public dataMassUnit: Array<ILookup>;
	public dataVolumeUnit: Array<ILookup>;

	// Lookup Tables
	public SamplePrepTechnique: Array<ILookup>;
	public PHECompetitor: Array<ILookup>;
	public PartNumber: Array<any>;
	public MfgCode: Array<ILookup>;
	public BrandCode: Array<ILookup>;
	public SampleStepType: Array<ILookup>;
	public CollectionPlate: Array<ILookup>;
	public SealingMat: Array<ILookup>;
	public MassUnit: Array<ILookup>;
	public VolumeUnit: Array<ILookup>;


	public samplePrepTechniqueKey: number;
	public pheCompetitorKey: number;
	public phePartNumberKey: number;
	public mfgCodeKey: number;
	public brandCodeKey: number;
	public collectionPlateKey: number;
	public sealingMatKey: number;
	public volumeUnitKey: number;
	public massUnitKey: number;

	public samplePrepTechniqueValue: string;
	public pheCompetitorValue: string;
	public partNumberValue: string;
	public mfgValue: string;
	public brandValue: string;
	public stepValue: string;
	public volumeUnitValue: string;
	public massUnitValue: string;

	// Constructor
	constructor(
		private fb: FormBuilder,
		private api: API,
		private router: Router,
		private route: ActivatedRoute,
		private meta: Meta,
		private title: Title,
		private lookupService: LookupService
	) {
		title.setTitle('App Manager - Create Sample Prep');
		this.showAppGrid = false;
		this.disabledButtonClear = true;
		this.getRelatedApp();
	}

	// On Destroy
	public ngOnDestroy() {
	}

	// OnInit
	public ngOnInit() {
		// No path indicates called from application form
		if (this.route.snapshot.routeConfig.path !== '') {
			// Used to return back to call from application form Sample Prep Meho
			this.cancelLink = '/' + this.route.snapshot.routeConfig.path + '/' + this.route.snapshot.params.id;
		}

		// initialize form
		this.samplePrepForm = this.fb.group({
			SamplePrepID: [''],
			CreatedBy: [''],
			SamplePrepTitle: ['', [Validators.required, Validators.minLength(5)]],
			PreTreatmentNotes: [''],
			SamplePrepNotes: [''],
			SamplePrepTechniqueKey: ['', [Validators.required]],
			PHECompetitorKey: ['', [Validators.required]],
			PHEPartNumberKey: [''],
			PartNumber: [''],
			Description1: [''],
			Description2: [''],
			CommercialDescription: [''],
			MfgCode: [''],
			BrandCode: [''],
			MfgCodeKey: [''],
			BrandCodeKey: [''],
			MassUnitKey: [''],
			MassUnit: [''],
			FormatTypeKey: ['', [Validators.required]],
			FormatVolume: [''],
			FormatVolumeKey: ['', [Validators.required]],
			VolumeUnitKey: ['', [Validators.required]],
			VolumeUnit: [''],
			FormatMass: [''],
			FormatMassKey: ['', [Validators.required]],
			CollectionPlate: [''],
			CollectionPlateKey: [''],
			SealingMat: [''],
			SealingMatKey: [''],
			SorbentLot: [''],
			ProductionLot: [''],
			Steps: this.fb.array([])
		});

		this.cloneButton = false;
		this.view = false;
		this.stepControl = <FormArray>this.samplePrepForm.controls['Steps'];

		// Retrieve all lookup tables
		this.api.get('lookup-sample-prep-technique.json', 'lookups/SamplePrepTechnique')
			.subscribe(r => {
				this.SamplePrepTechnique = r;
				this.dataSamplePrepTechnique = r.slice();
			})

		this.api.get('lookup-phe-competitor.json', 'lookups/PhenomenexOrCompetitorColumn')
			.subscribe(r => {
				this.PHECompetitor = r;
				this.dataPHECompetitor = r.slice();
			})

		this.api.get('lookup-sample-prep-step-type.json', 'lookups/SamplePrepStepType')
			.subscribe(r => {
				this.SampleStepType = r;
				this.dataSampleStepType = r.slice();
			})

		this.api.get('lookup-brand.json', 'lookups/BrandCode')
			.subscribe(r => {
				this.BrandCode = r;
				this.dataBrandCode = r.slice();
			})

		this.api.get('lookup-volume-unit.json', 'lookups/VolumeUnit')
			.subscribe(r => {
				this.VolumeUnit = r;
				this.dataVolumeUnit = r.slice();
			})

		this.api.get('lookup-mass-unit.json', 'lookups/MassUnit')
			.subscribe(r => {
				this.MassUnit = r;
				this.dataMassUnit = r.slice();
			})

		// Load Data
		this.loadData();
	}

	public state: State = {
		skip: 0,
		take: 20,
		filter: {
			logic: 'and',
			filters: []
		}
	}

	private filterChange() {
		if (this.state.filter.filters.length !== 0) {
			this.disabledButtonClear = false;
		} else {
			this.disabledButtonClear = true;
		}
		this.getRelatedApp();
	}

	private clearFilter(): void {
		this.disabledButtonClear = true;
		this.state.filter.filters = []; // Clear all filter input values
		this.getRelatedApp();
	}

	// Create new sample step. Optional parameters passed
	private createSampleStep(step?: number, typeKey?: number, details?: string) {
		return this.fb.group({
			Step: [step],
			TypeKey: [typeKey, [Validators.required]],
			TypeValue: [''],
			Details: [details, [Validators.required, Validators.minLength(1)]]
		})
	}

	// Add sample step to the list
	public addSampleStep() {
		this.stepControl.push(this.createSampleStep());
		return false;
	}

	// Remove sample step
	public removeSampleStep(i: number) {
		this.stepControl.removeAt(i);
	}

	// Change to edit mode
	private editFields() {
		this.view = !this.view;
	}

	private getFormattedDate(date): string {
		if (date === null || date === '') {
			return null;
		} else {
			let d = date.slice(0, 10).split('-');
			return d[1] + '-' + d[2] + '-' + d[0];
		}
	}

	// Function load data
	private loadData() {
		if (typeof (this.route.snapshot.params.id) !== 'undefined' && this.route.snapshot.routeConfig.path === '') {
			this.api.get('sample-prep.json', 'sample-preps/' + this.route.snapshot.params.id)
				.subscribe(r => {

					// console.log('sample r loadData', r);
					if (Object.getOwnPropertyNames(r).length !== 0) {
						this.cloneButton = true;
						this.samplePrepID = r['SamplePrepID'];
						this.createdOn = this.getFormattedDate(r['CreatedOn']);
						this.modifiedOn = this.getFormattedDate(r['ModifiedOn']);
						this.samplePrepForm.controls['SamplePrepTitle'].setValue(r['SamplePrepTitle']);
						this.samplePrepForm.controls['PreTreatmentNotes'].setValue(r['PreTreatmentNotes']);
						this.samplePrepForm.controls['SamplePrepNotes'].setValue(r['SamplePrepNotes']);
						this.samplePrepTechniqueKey = r['SamplePrepTechniqueKey'];

						this.phePartNumberKey = r['PHEPartNumberKey'];
						this.valueChangePHECompetitor(r['PHECompetitorKey']);

						this.api.get('lookup-mfg.json', 'lookups/MfgCode/' + r['PHECompetitorKey'])
							.subscribe(m => {
								this.MfgCode = m;
								this.dataMfgCode = m.slice();

								if (r['PHECompetitorKey'] === 1) {
									this.mfgValue = this.lookupService.lookupKeyValue(this.MfgCode, r['MfgCodeKey']);
									this.samplePrepForm.controls['MfgCode'].setValue(this.mfgValue);
								} else if (r['PHECompetitorKey'] === 2) {
									this.mfgValue = r['MfgCode'];
								}
								this.samplePrepForm.controls['MfgCode'].setValue(this.mfgValue);
							})

						if (r['PHECompetitorKey'] === 1) {
							if (r['Part'] !== null) {
								this.samplePrepForm.controls['PartNumber'].setValue(r['PartNumber']);
								this.samplePrepForm.controls['PHEPartNumberKey'].setValue(r['PHEPartNumberKey']);

								this.samplePrepForm.controls['BrandCodeKey'].setValue(r['Part'].BrandCodeKey);
								this.brandValue = this.lookupService.lookupKeyValue(this.BrandCode, r['Part'].BrandCodeKey);
								this.samplePrepForm.controls['BrandCode'].setValue(this.brandValue);

								this.changePartNumber(r['Part'], true);
							}
						} else {
							this.samplePrepForm.controls['PartNumber'].setValue(r['PartNumber']);
							this.samplePrepForm.controls['CommercialDescription'].setValue(r['CommercialDescription']);
							this.mfgCodeKey = r['MfgCodeKey'];
							this.brandCodeKey = r['BrandCodeKey'];
							this.samplePrepForm.controls['FormatTypeKey'].setValue(r['FormatTypeKey']);
							this.samplePrepForm.controls['FormatVolume'].setValue(r['FormatVolume']);
							this.volumeUnitKey = r['VolumeUnitKey'];
							this.samplePrepForm.controls['FormatMass'].setValue(r['FormatMass']);
							this.massUnitKey = r['MassUnitKey'];
						}

						this.samplePrepForm.controls['SorbentLot'].setValue(r['SorbentLot']);
						this.samplePrepForm.controls['ProductionLot'].setValue(r['ProductionLot']);
						this.samplePrepForm.controls['CollectionPlate'].setValue(r['CollectionPlate']);
						this.samplePrepForm.controls['CollectionPlateKey'].setValue(r['CollectionPlateKey']);
						this.samplePrepForm.controls['SealingMat'].setValue(r['SealingMat']);
						this.samplePrepForm.controls['SealingMatKey'].setValue(r['SealingMatKey']);

						if (r['Steps'].length !== 0) {
							for (const x of r['Steps']) {
								this.stepControl.push(this.createSampleStep(x.Step, x.TypeKey, x.Details));
							}
						} else {
							this.stepControl.push(this.createSampleStep());
						}

						this.showAppGrid = true;
						this.getRelatedApp();
					} else {
						this.stepControl.push(this.createSampleStep());
					}
				})
		} else {
			this.stepControl.push(this.createSampleStep());
		}
	}

	private getRelatedApp() {
		if (typeof (this.route.snapshot.params.id) !== 'undefined') {
			this.api.get('sample-prep-related-app.json', 'applications/' + this.route.snapshot.params.id + '/sample-preps')
				.subscribe(x => {
					this.gridData = filterBy(x, this.state.filter);
				})
		}
	}

	// Cloning Sample Prep
	private cloneSample() {
		this.samplePrepForm.value.SamplePrepID = 0;
		this.samplePrepForm.value.SamplePrepTitle = this.samplePrepForm.value.SamplePrepTitle + ' - Clone';

		this.api.post('sample-preps', this.samplePrepForm.value)
			.subscribe(res => {
				this.router.navigate(['/sample-preps']);
			});
	}

	// Submitting the Sample Prep form
	private onSubmit() {
		// this.view = !this.view;

		let row = 0;

		// Adding Step Type Value to Array
		for (const x of this.samplePrepForm.value.Steps) {
			row = row + 1;
			this.stepValue = this.lookupService.lookupKeyValue(this.SampleStepType, x.TypeKey);
			x.TypeValue = this.stepValue;
			x.Step = row;
		}

		// Lookup
		this.samplePrepTechniqueValue = this.lookupService.lookupKeyValue(this.SamplePrepTechnique, this.samplePrepForm.controls['SamplePrepTechniqueKey'].value);
		this.pheCompetitorValue = this.lookupService.lookupKeyValue(this.PHECompetitor, this.samplePrepForm.controls['PHECompetitorKey'].value);

		//
		if (typeof (this.route.snapshot.params.id) !== 'undefined') {
			this.samplePrepForm.controls['SamplePrepID'].setValue(Number(this.route.snapshot.params.id));
		} else {
			this.samplePrepForm.controls['SamplePrepID'].setValue(0);
		}
		// this.samplePrepForm.controls['CreatedBy'].setValue('User Name'); // TODO: Need  Creator User Name
		this.samplePrepForm.controls['PartNumber'].setValue(this.samplePrepForm.controls['PartNumber'].value);
		this.samplePrepForm.controls['Description1'].setValue(this.samplePrepForm.controls['Description1'].value);
		this.samplePrepForm.controls['Description2'].setValue(this.samplePrepForm.controls['Description2'].value);
		this.stepGrid = this.samplePrepForm.value.Steps;

		// Process to return to Application Form call
		if (this.route.snapshot.routeConfig.path !== '') {
			this.api.post('sample-preps', this.samplePrepForm.value)
				.subscribe(res => {
					this.api.put('applications/' + this.route.snapshot.params.id + '/sample-preps?spid=' + res['_body'])
						.subscribe(r => {
							this.returnSample();
						});
				});

		} else {
			if (typeof (this.route.snapshot.params.id) !== 'undefined') {
				this.api.put('sample-preps', this.samplePrepForm.value)
					.subscribe(res => {
						this.router.navigate(['/sample-preps']);
					});
			} else {
				this.api.post('sample-preps', this.samplePrepForm.value)
					.subscribe(res => {
						this.router.navigate(['/sample-preps']);
					});
			}
		}
	}

	// Populate Part Description for PHX Column
	public changePartNumber(partObj, onLoad) {
		// console.log('changePartNumber', onLoad, partObj);
		this.samplePrepForm.controls['Description1'].setValue(partObj.Description1);
		this.samplePrepForm.controls['Description2'].setValue(partObj.Description2);
		this.samplePrepForm.controls['FormatTypeKey'].setValue(partObj.FormatTypeKey);
		this.samplePrepForm.controls['FormatVolume'].setValue(partObj.FormatVolume);
		this.samplePrepForm.controls['FormatMass'].setValue(partObj.FormatMass);

		this.volumeUnitValue = this.lookupService.lookupKeyValue(this.VolumeUnit, partObj.VolumeUnitKey);
		this.samplePrepForm.controls['VolumeUnit'].setValue(this.volumeUnitValue);

		this.massUnitValue = this.lookupService.lookupKeyValue(this.MassUnit, partObj.MassUnitKey);
		this.samplePrepForm.controls['MassUnit'].setValue(this.massUnitValue);

		if (onLoad === false) {
			// Lookup Mfg Code
			if (partObj.MfgCodeKey !== 0) {
				this.mfgValue = this.lookupService.lookupKeyValue(this.MfgCode, partObj.MfgCodeKey); // TODO: Subscribe issue
				this.samplePrepForm.controls['MfgCode'].setValue(this.mfgValue);
				this.samplePrepForm.controls['MfgCodeKey'].setValue(partObj.MfgCodeKey);
			} else {
				this.samplePrepForm.controls['MfgCode'].setValue('');
				this.mfgCodeKey = null;
			}

			// Lookup Brand Code
			if (partObj.BrandCodeKey !== 0) {
				this.brandValue = this.lookupService.lookupKeyValue(this.BrandCode, partObj.BrandCodeKey);
				this.samplePrepForm.controls['BrandCode'].setValue(this.brandValue);
				this.samplePrepForm.controls['BrandCodeKey'].setValue(partObj.BrandCodeKey);
			} else {
				this.samplePrepForm.controls['BrandCode'].setValue('');
				this.samplePrepForm.controls['BrandCodeKey'].setValue('');
			}
		}
	}


	// Return back to application call
	private returnSample() {
		this.router.navigate([this.cancelLink]);
		// window.location.reload();
	}

	// Looking Key-Value from provided Array<objects>
	private lookupKeyValue(lookupTable: Array<ILookup>, lookupValue: number): string {
		if (typeof (lookupValue) !== 'undefined') {
			for (const record of lookupTable) {
				if (record['Key'] === lookupValue) {
					return record['Value'];
				}
			}
		}
		return null;
	}

	// Enable and Disable Fields
	private valueChangePHECompetitor(pheCompKey: number) {
		this.pheCompetitorKey = pheCompKey;

		if (typeof (pheCompKey) !== 'undefined') {
			// When called from PHECompetitorKey drop down
			this.api.get('lookup-mfg.json', 'lookups/MfgCode/' + this.pheCompetitorKey)
				.subscribe(r => {
					this.MfgCode = r;
					this.dataMfgCode = r.slice();
				})

			if (pheCompKey === 1) {
				this.samplePrepForm.controls['Description1'].disable();
				this.samplePrepForm.controls['Description2'].disable();
				this.samplePrepForm.controls['MfgCode'].disable();
				this.samplePrepForm.controls['BrandCode'].disable();
				this.samplePrepForm.controls['FormatVolume'].disable();
				this.samplePrepForm.controls['VolumeUnit'].disable();
				this.samplePrepForm.controls['FormatMass'].disable();
				this.samplePrepForm.controls['MassUnit'].disable();
				this.samplePrepForm.controls['MfgCodeKey'].disable();
				this.samplePrepForm.controls['BrandCodeKey'].disable();
				this.samplePrepForm.controls['FormatVolumeKey'].disable();
				this.samplePrepForm.controls['FormatTypeKey'].disable();
				this.samplePrepForm.controls['VolumeUnitKey'].disable();
				this.samplePrepForm.controls['FormatMassKey'].disable();
			} else {
				this.samplePrepForm.controls['MfgCode'].enable();
				this.samplePrepForm.controls['BrandCode'].enable();
				this.samplePrepForm.controls['FormatVolume'].enable();
				this.samplePrepForm.controls['VolumeUnit'].enable();
				this.samplePrepForm.controls['FormatMass'].enable();
				this.samplePrepForm.controls['MassUnit'].enable();
				this.samplePrepForm.controls['MfgCodeKey'].enable();
				this.samplePrepForm.controls['BrandCodeKey'].enable();
				this.samplePrepForm.controls['FormatVolumeKey'].enable();
				this.samplePrepForm.controls['FormatTypeKey'].enable();
				this.samplePrepForm.controls['VolumeUnitKey'].enable();
				this.samplePrepForm.controls['FormatMassKey'].enable();
			}
		}

		// Clear all input fields
		this.samplePrepForm.controls['PartNumber'].setValue('');
		this.samplePrepForm.controls['MfgCode'].setValue('');
		this.samplePrepForm.controls['BrandCode'].setValue('');
		this.samplePrepForm.controls['MfgCodeKey'].setValue('');
		this.samplePrepForm.controls['BrandCodeKey'].setValue('');
		this.samplePrepForm.controls['CommercialDescription'].setValue('');
		this.samplePrepForm.controls['Description1'].setValue('');
		this.samplePrepForm.controls['Description2'].setValue('');
		this.samplePrepForm.controls['FormatTypeKey'].setValue('');
		this.samplePrepForm.controls['FormatVolume'].setValue('');
		this.samplePrepForm.controls['VolumeUnit'].setValue('');
		this.samplePrepForm.controls['FormatMass'].setValue('');
		this.samplePrepForm.controls['MassUnit'].setValue('');
	}

	// data for filterChange on combobox
	private filterChangeSamplePrepTechnique(val) {
		this.dataSamplePrepTechnique = this.SamplePrepTechnique.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	private filterChangePHECompetitor(val) {
		this.dataPHECompetitor = this.PHECompetitor.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	private filterChangeMfgCode(val) {
		this.dataMfgCode = this.MfgCode.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	private filterChangeBrandCode(val) {
		this.dataBrandCode = this.BrandCode.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
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

	private valueChangePartNumber(val) {
		if (typeof (val) !== 'undefined') {
			this.phePartNumberKey = this.lookupService.lookupKey(this.PartNumber, val);
			this.samplePrepForm.controls['PHEPartNumberKey'].setValue(this.phePartNumberKey);

			this.api.get('lookup-part-number.json', 'applications/partnumber/' + this.phePartNumberKey)
				.subscribe(r => {
					this.dataPartNumber = r;
					this.changePartNumber(r, false);
				})
		}
	}

	private filterChangeCollectionPlate(val) {
		if (val.length >= 3) {
			this.api.get('lookup-collection-plate.json', 'lookups-search/CollectionPlate/' + val + '')
				.subscribe(r => {
					this.CollectionPlate = r;
				})
		} else {
			this.autocomplete.toggle(false);
		}
	}

	private valueChangeCollectionPlate(val) {
		this.collectionPlateKey = this.lookupService.lookupKey(this.CollectionPlate, val);
		this.samplePrepForm.controls['CollectionPlateKey'].setValue(this.collectionPlateKey);
	}

	private filterChangeSealingMat(val) {
		if (val.length >= 3) {
			this.api.get('lookup-sealing-mat.json', 'lookups-search/SealingMat/' + val + '')
				.subscribe(r => {
					this.SealingMat = r;
				})
		} else {
			this.autocomplete.toggle(false);
		}
	}

	private valueChangeSealingMat(val) {
		this.sealingMatKey = this.lookupService.lookupKey(this.SealingMat, val);
		this.samplePrepForm.controls['SealingMatKey'].setValue(this.sealingMatKey);
	}

	private filterChangeVolumeUnitKey(val) {
		this.dataVolumeUnit = this.VolumeUnit.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	private filterChangeMassUnitKey(val) {
		this.dataMassUnit = this.MassUnit.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}
}
