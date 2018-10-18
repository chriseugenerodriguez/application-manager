import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { API, ILookup, AuthenticationService } from '../../../../core/index';

@Component({
	moduleId: module.id,
	selector: 'phx-instrumentation-conditions',
	templateUrl: 'instrumentation-conditions.component.html'
})

export class InstrumentationConditionsComponent implements OnInit {

	// DONE
	@Output() done: EventEmitter<boolean> = new EventEmitter(false);
	finish: boolean = false;

	@Input('form') InstrumentationConditions: FormGroup;  // Reactive Form
	@Input('statusComponent') statusComponent: any;
	@Input() Opened: boolean;

	public permissions: Array<object>;
	private stepGrid: Array<object>;
	public location: string;
	public InstrumentationConditionsOpened: boolean;
	public InstrumentationConditionsDisabled: boolean;

	// DISABLED
	public disabled: boolean;

	public stepControl: any;
	public stepData: any;
	public appFormType: number;
	public isValidForm = false;
	public stepRow: number;

	// Lookup Keys
	public carrierGasKey: number;
	public injectionModeKey: number;
	public flowRateTechniqueKey: number;
	public flowRateUnitKey: number;
	public gcSystemKey: number;
	public oneUnitKey: number;
	public twoUnitKey: number;
	public flowRateKey: number;
	public injUnitKey: number;
	public lcSystemKey: number;
	public detectorTypeKey: number;
	public detectorInstrumentationKey: number;
	public ionizationTypeKey: number;

	// Lookup Values
	public gcSystemValue: string;
	public injUnitValue: string;
	public lcSystemValue: string;
	public detectorTypeValue: string;
	public detectorInstrumentationValue: string;
	public ionizationTypeValue: string;
	public oneUnitValue: string;
	public twoUnitValue: string;
	public oneWaveLengthUnitValue: string;
	public twoWaveLengthUnitValue: string;
	public flowRateUnitValue: string;
	public flowRateTechniqueValue: string;
	public injectionModeValue: string;
	public carrierGasValue: string;
	public stepFlowRateUnitValue: string;

	// SELECT FIELDS DATA
	public InjUnit: Array<ILookup>;
	public GCSystem: Array<ILookup>;
	public DetectorType: Array<ILookup>;
	public DetectorInstrumentation: Array<ILookup>;
	public LCSystem: Array<ILookup>;
	public OneUnit: Array<ILookup>;
	public TwoUnit: Array<ILookup>;
	public FlowRateUnit: Array<ILookup>;
	public InjectionMode: Array<ILookup>;
	public CarrierGas: Array<ILookup>;
	public IonizationType: Array<ILookup>;
	public FlowRateTechnique: Array<ILookup>;
	public FlowTypeKey: Array<ILookup>;
	public StepFlowRateUnit: Array<ILookup>;

	// data for filterChange on combobox
	public dataInjUnit: Array<ILookup>;
	public dataGCSystem: Array<ILookup>;
	public dataDetectorType: Array<ILookup>;
	public dataDetectorInstrumentation: Array<ILookup>;
	public dataLCSystem: Array<ILookup>;
	public dataOneUnit: Array<ILookup>;
	public dataTwoUnit: Array<ILookup>;
	public dataFlowRateUnit: Array<ILookup>;
	public dataInjectionMode: Array<ILookup>;
	public dataCarrierGas: Array<ILookup>;
	public dataIonizationType: Array<ILookup>;
	public dataFlowRateTechnique: Array<ILookup>;
	public dataFlowTypeKey: Array<ILookup>;
	public dataStepFlowRateUnit: Array<ILookup>;

	constructor(
		private _router: Router,
		private fb: FormBuilder,
		private api: API,
		private route: ActivatedRoute,
		private AS: AuthenticationService
	) {

		// SHOW / HIDE INPUTS ON URL
		this.location = _router.url;

		this.stepRow = 0;
	}

	ngOnInit() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {

			// 1 = LC, 2 = GC
			if (this.location.indexOf('form-lc') !== -1) {
				this.appFormType = 1;
				this.stepControl = <FormArray>this.InstrumentationConditions.controls['StepLC'];
				this.stepData = this.InstrumentationConditions.get('StepLC') as FormArray;
			} else {
				this.appFormType = 2;
				this.stepControl = <FormArray>this.InstrumentationConditions.controls['StepGC'];
				this.stepData = this.InstrumentationConditions.get('StepGC') as FormArray;
			}

			this.loadData().subscribe(r => {
				this.CarrierGas = r[0];
				this.dataCarrierGas = r[0];

				this.InjectionMode = r[1];
				this.dataInjectionMode = r[1];

				this.StepFlowRateUnit = r[2];
				this.dataStepFlowRateUnit = r[2];

				this.FlowRateUnit = r[3];
				this.dataFlowRateUnit = r[3];

				this.OneUnit = r[4];
				this.dataOneUnit = r[4];

				this.TwoUnit = r[5];
				this.dataTwoUnit = r[5];

				this.GCSystem = r[6];
				this.dataGCSystem = r[6];

				this.InjUnit = r[7];
				this.dataInjUnit = r[7];

				this.LCSystem = r[8];
				this.dataLCSystem = r[8];

				this.DetectorType = r[9];
				this.dataDetectorType = r[9];

				this.DetectorInstrumentation = r[10];
				this.dataDetectorInstrumentation = r[10];

				this.IonizationType = r[11];
				this.dataIonizationType = r[11];

				this.FlowTypeKey = r[12];
				this.dataFlowTypeKey = r[12];

				this.FlowRateTechnique = r[13];
				this.dataFlowRateTechnique = r[13];

				if (Object.getOwnPropertyNames(r[14]).length !== 0) {

					this.InstrumentationConditions.controls['InjectionVolume'].setValue(r[14]['InstrumentationConditions'].InjectionVolume);

					this.InstrumentationConditions.controls['InjectionUnitKey'].setValue(r[14]['InstrumentationConditions'].InjectionUnitKey);
					this.injUnitKey = r[14]['InstrumentationConditions'].InjectionUnitKey;
					this.injUnitValue = this.lookupKeyValue(this.InjUnit, r[14]['InstrumentationConditions'].InjectionUnitKey);

					this.InstrumentationConditions.controls['InjectorTemp'].setValue(r[14]['InstrumentationConditions'].InjectorTemp);

					this.InstrumentationConditions.controls['DetectorTemp'].setValue(r[14]['InstrumentationConditions'].DetectorTemp);

					this.InstrumentationConditions.controls['DetectorTypeKey'].setValue(r[14]['InstrumentationConditions'].DetectorTypeKey);
					this.detectorTypeKey = r[14]['InstrumentationConditions'].DetectorTypeKey;
					this.detectorTypeValue = this.lookupKeyValue(this.DetectorType, r[14]['InstrumentationConditions'].DetectorTypeKey);

					this.InstrumentationConditions.controls['DetectorInstrumentationKey'].setValue(r[14]['InstrumentationConditions'].DetectorInstrumentationKey);
					this.detectorInstrumentationKey = r[14]['InstrumentationConditions'].DetectorInstrumentationKey;
					this.detectorInstrumentationValue = this.lookupKeyValue(this.DetectorInstrumentation, r[14]['InstrumentationConditions'].DetectorInstrumentationKey);

					this.InstrumentationConditions.controls['Unit1Key'].setValue(r[14]['InstrumentationConditions'].Unit1Key);
					this.oneUnitKey = r[14]['InstrumentationConditions'].Unit1Key;
					this.oneUnitValue = this.lookupKeyValue(this.OneUnit, r[14]['InstrumentationConditions'].Unit1Key);

					this.InstrumentationConditions.controls['Unit2Key'].setValue(r[14]['InstrumentationConditions'].Unit2Key);
					this.twoUnitKey = r[14]['InstrumentationConditions'].Unit2Key;
					this.twoUnitValue = this.lookupKeyValue(this.TwoUnit, r[14]['InstrumentationConditions'].Unit2Key);

					if (this.location.indexOf('form-lc') !== -1) {
						this.InstrumentationConditions.controls['ColumnTemp'].setValue(r[14]['InstrumentationConditions'].ColumnTemp);
						this.InstrumentationConditions.controls['LCSystemKey'].setValue(r[14]['InstrumentationConditions'].LCSystemKey);
						this.lcSystemKey = r[14]['InstrumentationConditions'].LCSystemKey;
						this.lcSystemValue = this.lookupKeyValue(this.LCSystem, r[14]['InstrumentationConditions'].LCSystemKey);
						this.InstrumentationConditions.controls['Wavelength1'].setValue(r[14]['InstrumentationConditions'].Wavelength1);
						this.InstrumentationConditions.controls['Wavelength2'].setValue(r[14]['InstrumentationConditions'].Wavelength2);

						this.InstrumentationConditions.controls['IonizationTypeKey'].setValue(r[14]['InstrumentationConditions'].IonizationTypeKey);
						this.ionizationTypeKey = r[14]['InstrumentationConditions'].IonizationTypeKey;
						this.ionizationTypeValue = this.lookupKeyValue(this.IonizationType, r[14]['InstrumentationConditions'].IonizationTypeKey);

						this.InstrumentationConditions.controls['Backpressure'].setValue(r[14]['InstrumentationConditions'].Backpressure);

						if (r[14]['InstrumentationConditions'].StepLC.length !== 0) {
							for (const x of r[14]['InstrumentationConditions'].StepLC) {
								this.stepControl.push(this.createStepLC(
									x.StepNumber,
									x.TimeM,
									x.FlowRateG,
									x.FlowRateUnitKey,
									x.EluentA,
									x.EluentAP,
									x.EluentB,
									x.EluentBP,
									x.EluentC,
									x.EluentCP,
									x.EluentD,
									x.EluentDP
								));
								x.FlowRateUnitValue = this.lookupKeyValue(this.dataStepFlowRateUnit, x.FlowRateUnitKey);
							}
							this.stepGrid = r[14]['InstrumentationConditions'].StepLC;
						} else {
							this.stepControl.push(this.createStepLC());
						}
					} else {
						this.InstrumentationConditions.controls['GCSystemKey'].setValue(r[14]['InstrumentationConditions'].GCSystemKey);
						this.gcSystemKey = r[14]['InstrumentationConditions'].GCSystemKey;
						this.gcSystemValue = this.lookupKeyValue(this.GCSystem, r[14]['InstrumentationConditions'].GCSystemKey);
						this.InstrumentationConditions.controls['DetectorDetail1'].setValue(r[14]['InstrumentationConditions'].DetectorDetail1);
						this.InstrumentationConditions.controls['DetectorDetail2'].setValue(r[14]['InstrumentationConditions'].DetectorDetail2);

						this.InstrumentationConditions.controls['FlowRateUnitKey'].setValue(r[14]['InstrumentationConditions'].FlowRateUnitKey);
						this.flowRateUnitKey = r[14]['InstrumentationConditions'].FlowRateUnitKey;
						this.InstrumentationConditions.controls['FlowRate'].setValue(r[14]['InstrumentationConditions'].FlowRate);
						this.flowRateUnitValue = this.lookupKeyValue(this.FlowRateUnit, r[14]['InstrumentationConditions'].FlowRateUnitKey);

						this.InstrumentationConditions.controls['FlowRateTechniqueKey'].setValue(r[14]['InstrumentationConditions'].FlowRateTechniqueKey);
						this.flowRateTechniqueKey = r[14]['InstrumentationConditions'].FlowRateTechniqueKey;
						this.flowRateTechniqueValue = this.lookupKeyValue(this.FlowRateTechnique, r[14]['InstrumentationConditions'].FlowRateTechniqueKey);

						this.InstrumentationConditions.controls['InjectionModeKey'].setValue(r[14]['InstrumentationConditions'].InjectionModeKey);
						this.injectionModeKey = r[14]['InstrumentationConditions'].InjectionModeKey;
						this.injectionModeValue = this.lookupKeyValue(this.InjectionMode, r[14]['InstrumentationConditions'].InjectionModeKey);

						this.InstrumentationConditions.controls['CarrierGasKey'].setValue(r[14]['InstrumentationConditions'].CarrierGasKey);
						this.carrierGasKey = r[14]['InstrumentationConditions'].CarrierGasKey;
						this.carrierGasValue = this.lookupKeyValue(this.CarrierGas, r[14]['InstrumentationConditions'].CarrierGasKey);

						this.InstrumentationConditions.controls['SplitRatio'].setValue(r[14]['InstrumentationConditions'].SplitRatio);
						this.InstrumentationConditions.controls['SplitlessHoldTime'].setValue(r[14]['InstrumentationConditions'].SplitlessHoldTime);
						this.InstrumentationConditions.controls['AdditionalDetail'].setValue(r[14]['InstrumentationConditions'].AdditionalDetail);

						if (r[14]['InstrumentationConditions'].StepGC.length !== 0) {
							for (const x of r[14]['InstrumentationConditions'].StepGC) {
								this.stepControl.push(this.createStepGC(
									x.StepNumber,
									x.TempC,
									x.FlowTime,
									x.TempRate
								));
								x.FlowTypeValue = this.lookupKeyValue(this.dataFlowTypeKey, x.FlowTypeKey);
							}
							this.stepGrid = r[14]['InstrumentationConditions'].StepGC;
						} else {
							this.stepControl.push(this.createStepGC());
						}
					}
				}

				this.AS.isLoggedIn().subscribe(loggedin => {
					if (loggedin) {
						this.permission();
					}
				});
			});
		};
	}

	loadData(): Observable<any> {
		let r0 = this.api.get('lookup-carrier-gas.json', 'lookups/CarrierGas');
		let r1 = this.api.get('lookup-injection-mode.json', 'lookups/InjectionMode');
		let r2 = this.api.get('lookup-application-step-unit.json', 'lookups/ApplicationStepUnit');
		let r3 = this.api.get('lookup-flow-rate-unit.json', 'lookups/FlowRateUnit');
		let r4 = this.api.get('lookup-detector-unit1.json', 'lookups/DetectorUnit1');
		let r5 = this.api.get('lookup-detector-unit1.json', 'lookups/DetectorUnit2');
		let r6 = this.api.get('lookup-gc-system.json', 'lookups/GCSystem');
		let r7 = this.api.get('lookup-inj-unit.json', 'lookups/InjectionUnit');
		let r8 = this.api.get('lookup-lc-system.json', 'lookups/LCSystem');
		let r9 = this.api.get('lookup-detector-type-' + this.appFormType + '.json', 'lookups/DetectorType/' + this.appFormType);
		let r10 = this.api.get('lookup-detector-instrumentation-' + this.appFormType + '.json', 'lookups/DetectorInstrumentation/' + this.appFormType);
		let r11 = this.api.get('lookup-ionization-type.json', 'lookups/IonizationType');
		let r12 = this.api.get('lookup-application-step-type.json', 'lookups/ApplicationStepType');
		let r13 = this.api.get('lookup-flow-rate-technique.json', 'lookups/FlowRateTechnique')
		let r14 = this.api.get('application.json', 'applications/' + this.route.snapshot.params.id);

		return Observable.forkJoin([r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14]);
	}

	public permission() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.api.get('user-role-assigned-to.json', 'users/' + this.AS.getTokenDecoded()['sub']).subscribe(r => {
				this.permissions = r;

				for (let x = 0; x < this.permissions['Roles'].length; x++) {
					let c = this.permissions['Roles'][x].InstrumentationConditions;

					if (!this.statusComponent.PHE) {
						if (c.Read === false && c.Write === false) {
							this.InstrumentationConditionsDisabled = true;
							this.InstrumentationConditionsOpened = false;
						}
						if (c.Read === true && c.Write === false) {

							this.InstrumentationConditions.disable();

							this.stepControl.disable();
							this.disabled = true;
						}
						if (c.Read === false && c.Write === true || c.Read === true && c.Write === true) {
							this.InstrumentationConditions.enable();

							this.stepControl.enable();
							this.disabled = false;
						}
					}
				}

				let b;
				for (let x = 0; x < this.permissions.length; x++) {
					if (x['Admin']) {
						b = x['Admin'];
					}
					if (b === true) {
						this.InstrumentationConditions.enable();
						this.disabled = false;
					} else {
						this.InstrumentationConditions.disable();
						this.disabled = true;
					}
				}

				this.done.emit(true);
				this.finish = true;
			})
		}
	}

	// Create new sample step. Optional parameters passed
	private createStepLC(stepNumber?: number, timeM?: number, flowRateG?: number, flowRateUnitKey?: number, eluentA?: string, eluentAP?: number,
		eluentB?: string, eluentBP?: number, eluentC?: string, eluentCP?: number, eluentD?: string, eluentDP?: number) {

		if (stepNumber !== null) {
			this.stepRow = stepNumber;
		} else {
			this.stepRow = this.stepRow + 1;
		}

		return this.fb.group({
			StepNumber: [this.stepRow],
			TimeM: [timeM, Validators.required],
			FlowRateG: [flowRateG, Validators.required],
			FlowRateUnitKey: [flowRateUnitKey, Validators.required],
			FlowRateUnitValue: [],
			EluentA: [eluentA, Validators.required],
			EluentAP: [eluentAP, Validators.required],
			EluentB: [eluentB],
			EluentBP: [eluentBP],
			EluentC: [eluentC],
			EluentCP: [eluentCP],
			EluentD: [eluentD],
			EluentDP: [eluentDP]
		})
	}

	private createStepGC(stepNumber?: number, tempC?: number, flowTime?: number, tempRate?: number) {
		if (stepNumber !== null) {
			this.stepRow = stepNumber;
		} else {
			this.stepRow = this.stepRow + 1;
		}

		return this.fb.group({
			StepNumber: [this.stepRow],
			TempC: [tempC, Validators.required],
			FlowTime: [flowTime, Validators.required],
			TempRate: [tempRate, Validators.required],
		});
	}

	public removeStep(idx: number) {
		if (this.location.indexOf('form-lc') !== -1) {
			this.stepControl.controls['StepLC'];
		} else {
			this.stepControl.controls['StepGC'];
		}
		this.stepControl.removeAt(idx);
	}

	// Calling child method
	public addStep() {
		let a = {};
		this.stepRow = this.stepRow + 1;
		a = this.stepData.at(0).value;
		delete a['StepNumber'];

		if (this.location.indexOf('form-lc') !== -1) {
			this.stepControl.push(
				this.createStepLC(
					this.stepRow,
					a['TimeM'],
					a['FlowRateG'],
					a['FlowRateUnitKey'],
					a['EluentA'],
					a['EluentAP'],
					a['EluentB'],
					a['EluentBP'],
					a['EluentC'],
					a['EluentCP'],
					a['EluentD'],
					a['EluentDP']
				)
			);
		} else {
			this.stepControl.push(
				this.createStepGC(
					this.stepRow,
					a['TempC'],
					a['FlowTime'],
					a['TempRate']
				)
			);
		}
		return false;
	}

	// Looking Key-Value from provided Array<objects>
	private lookupKeyValue(lookupTable: Array<ILookup>, lookupValue: number): string {
		for (const record of lookupTable) {
			if (record['Key'] === lookupValue) {
				return record['Value'];
			}
		}

		return null;
	}

	// Filter PHE or Competitor
	public filterChangeInjUnit(val) {
		this.dataInjUnit = this.InjUnit.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeLCSystem(val) {
		this.dataLCSystem = this.LCSystem.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeDetectorType(val) {
		this.dataDetectorType = this.DetectorType.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeDetectorInstrumentation(val) {
		this.dataDetectorInstrumentation = this.DetectorInstrumentation.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeIonizationType(val) {
		this.dataIonizationType = this.IonizationType.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeGCSystem(val) {
		this.dataGCSystem = this.GCSystem.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeOneUnit(val) {
		this.dataOneUnit = this.OneUnit.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeTwoUnit(val) {
		this.dataTwoUnit = this.TwoUnit.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeFlowRateUnit(val) {
		this.dataFlowRateUnit = this.FlowRateUnit.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeFlowRateTechnique(val) {
		this.dataFlowRateTechnique = this.FlowRateTechnique.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeInjectionMode(val) {
		this.dataInjectionMode = this.InjectionMode.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeCarrierGas(val) {
		this.dataCarrierGas = this.CarrierGas.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}
}
