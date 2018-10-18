import { Component, OnInit, Input, ElementRef, Renderer, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser'; // SEO
import { Router, ActivatedRoute } from '@angular/router';

// CHILDREN
import * as _ from 'lodash';
import { IApplicationForm, API } from '../../../core/index';
import { AnalyteDetailsComponent } from './analyte-details/analyte-details.component';
import { ChromatogramsComponent } from './chromatograms/chromatograms.component';
import { CodingRelatedTermsComponent } from './coding-related-terms/coding-related-terms.component';
import { ColumnDetailsComponent } from './column-details/column-details.component';
import { DocumentTermsComponent } from './document-terms/document-terms.component';
import { InstrumentationConditionsComponent } from './instrumentation-conditions/instrumentation-conditions.component';
import { OverviewComponent } from './overview/overview.component';
import { SamplePreparationMethodologyComponent } from './sample-preparation-methodology/sample-preparation-methodology.component';
import { StatusComponent } from './status/status.component';
import { AuthenticationService } from 'app/core/services/auth.service';

// SSR
import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DoesNotContainFilterOperatorComponent } from '@progress/kendo-angular-grid';

// RXJS
import { AsyncSubject } from 'rxjs/AsyncSubject';

@Component({
	moduleId: module.id,
	selector: 'phx-form',
	templateUrl: 'form.component.html',
	providers: [API]
})

export class FormComponent implements OnInit {
	// DONE
	output: Array<boolean> = [];
	done: boolean;

	// SIDEBAR
	public location: string;
	public createdBy: string;
	public createdOn: string;
	public modifiedOn: string;
	public modifiedBy: string;
	public statusValue: string;
	public roleAssignTo: Array<object> = [];
	public roleAssignList: Array<string> = [];
	public save: boolean;

	// public assignedToKey: number;
	public statusKey: number;
	public applicationID: number;
	public permissions: any;
	public publishPermission: boolean;
	public reviewer: string;

	// TOGGLE
	public isOpen: boolean;
	public cloneButton: boolean;

	// SUBMIT BUTTONS
	public approve: boolean;
	public send: boolean;
	public publish: boolean;
	public approved: boolean;
	public reject: boolean;

	// EVENTS
	public error: {};

	// DELETE
	delete: boolean;
	deleteConfirm: boolean;
	deleteDone: boolean;
	@Input() deleteCount: number = 0;
	@Output() deleteUpdate = new EventEmitter<any>();

	// SHOW / HIDE
	archive: boolean;
	showWeb: boolean;
	hideWeb: boolean;
	archiveSpinner: boolean;

	// ADMIN
	admin: boolean;

	// STATUS
	@ViewChild(StatusComponent) statusComponent: StatusComponent;

	// CHILDREN
	@ViewChild(OverviewComponent) overviewComponent: OverviewComponent;
	@ViewChild(ColumnDetailsComponent) columnDetailsComponent: ColumnDetailsComponent;
	@ViewChild(InstrumentationConditionsComponent) instrumentationConditionsComponent: InstrumentationConditionsComponent;
	@ViewChild(AnalyteDetailsComponent) analyteDetailsComponent: AnalyteDetailsComponent;
	@ViewChild(SamplePreparationMethodologyComponent) samplePreparationMethodologyComponent: SamplePreparationMethodologyComponent;
	@ViewChild(DocumentTermsComponent) documentTermsComponent: DocumentTermsComponent;
	@ViewChild(CodingRelatedTermsComponent) codingRelatedTermsComponent: CodingRelatedTermsComponent;
	@ViewChild(ChromatogramsComponent) chromatogramsComponent: ChromatogramsComponent;

	// REACTIVE FORM
	ApplicationForm: FormGroup;

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		private formBuilder: FormBuilder,
		private meta: Meta,
		private title: Title,
		private router: Router,
		private route: ActivatedRoute,
		private renderer: Renderer,
		public accordion: ElementRef,
		private api: API,
		private AS: AuthenticationService
	) {
		this.statusValue = '';
		this.isOpen = false;
		this.approve = false;
		this.send = true;
		this.publishPermission = false;
		this.save = false;
		this.applicationID = 0;
		this.approved = false;
		this.reject = false;

		title.setTitle('Phenomenex - Application Form');

		this.LCFormBuilder().valueChanges.subscribe(() => {
			const invalid = [];
			const controls = this.ApplicationForm.value.ColumnDetails.controls;
			for (const name in controls) {
				if (controls[name].invalid) {
					invalid.push(name);
				}
			}
		})

		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.api.get('user-role-assigned-to.json', 'users/' + this.AS.getTokenDecoded()['sub']).subscribe(r => {
				this.permissions = r['Roles'];
				this.publishPermission = this.permissions[0]['Publish'];
			})
		}
	}

	public ngOnInit() {
		this.location = this.router.url;
		// Pushing to child component
		if (this.location.indexOf('form-lc') !== -1) {
			this.LCFormBuilder()
		} else {
			this.GCFormBuilder()
		}

		// Only if an 'id' is passed
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.api.get('application.json', 'applications/' + this.route.snapshot.params.id)
				.subscribe(r => {
					if (Object.getOwnPropertyNames(r).length !== 0) {
						// Save Values to be able to submit in View Mode
						this.ApplicationForm.controls['ApplicationID'].setValue(r['ApplicationID']);
						this.ApplicationForm.controls['ApplicationTypeKey'].setValue(r['ApplicationTypeKey']);
						this.ApplicationForm.controls['CreatedBy'].setValue(r['CreatedBy']);
						this.ApplicationForm.controls['CreatedOn'].setValue(r['CreatedOn']);
						if (r['StatusKey'] < 3) {
							this.ApplicationForm.controls['Reviewer'].setValue(r['Reviewer']);
						}
						if (r['StatusKey'] === 7) {
							this.hideWeb = true;
							this.showWeb = false;
						}
						if (r['StatusKey'] === 8) {
							this.showWeb = true;
							this.hideWeb = false;
						}
						this.ApplicationForm.controls['StatusKey'].setValue(r['StatusKey']);
						this.ApplicationForm.controls['Published'].setValue(r['Published']);
						this.ApplicationForm.controls['Chromatogram'].setValue(r['Chromatogram']);

						this.applicationID = r['ApplicationID'];
						this.cloneButton = true;

						this.createdOn = r['CreatedOn'];
						if (this.createdOn !== null && this.createdOn !== '') {
							let d = this.createdOn.slice(0, 10).split('-');
							this.createdOn = d[1] + '-' + d[2] + '-' + d[0];
						}
						this.modifiedBy = r['ModifiedBy'];
						this.modifiedOn = r['ModifiedOn'];
						if (this.modifiedOn !== null && this.modifiedOn !== '') {
							let d2 = this.modifiedOn.slice(0, 10).split('-');
							this.modifiedOn = d2[1] + '-' + d2[2] + '-' + d2[0];
						}
						this.createdBy = r['CreatedBy'];
						this.statusKey = r['StatusKey'];

						// Determine Application Form Status
						if (this.statusKey === 2) {
							this.statusComponent.AnalystReview = true;
						} else if (this.statusKey === 3) {
							this.statusComponent.MarketingDraft = true;
						} else if (this.statusKey === 4) {
							this.statusComponent.MarketingReview = true;
						} else if (this.statusKey === 5) {
							this.statusComponent.ChromatogramUpload = true;
						} else if (this.statusKey === 6) {
							this.statusComponent.WebApproval = true;
						} else if (this.statusKey === 7) {
							this.statusComponent.PHE = true;
						} else if (this.statusKey === 8) {
							this.statusComponent.PHE = true;
						} else {
							this.statusComponent.AnalystDraft = true;
						}

						// Need to wait for api to return before updating Status Component
						this.updateStatusComponent();
					}
				})
		} else {
			this.statusComponent.AnalystDraft = true;
			this.updateStatusComponent();
		}

		// Filter to a new array for Assign-To dropdown list
		const isLoggedIn = this.AS.isLoggedIn();
		isLoggedIn.subscribe(loggedin => {
			if (loggedin) {
				this.roles();
			}
		});
	}

	private LCFormBuilder() {
		return this.ApplicationForm = this.formBuilder.group({
			ApplicationID: [null],
			Published: [null],
			CreatedBy: [''],
			CreatedOn: [''],
			Reviewer: [null],
			ReviewerEmail: [''],
			StatusKey: [1],
			ApplicationTypeKey: [1],
			Overview: this.formBuilder.group({
				ApplicationTitle: ['', [Validators.required, Validators.minLength(2)]],
				ApplicationReason: [''],
				CustomerThirdPartyDetails: [''],
				SeparationModeKey: ['', [Validators.required]]
			}),
			ColumnDetails: this.formBuilder.group({
				PhenomenexOrCompetitorColumnKey: ['', [Validators.required]],
				PartNumberKey: [''],
				PartNumber: [''],
				Description1: [''],
				Description2: [''],
				CommercialDescription: [''],
				MfgCode: [''],
				MfgCodeKey: [''],
				BrandCode: [''],
				BrandCodeKey: [''],
				Length: ['', [Validators.required]],
				InternalDiameter: ['', [Validators.required]],
				ParticleSize: ['', [Validators.required]],
				PoreSize: ['', [Validators.required]],
				SerialNumber: [''],
				BatchNumber: [''],
				ColumnEfficiency: [''],
				PeakCapacity: [''],
				GuardCartridge: [''],
				GuardCartridgeKey: [''],
				GuardHolder: [''],
				GuardHolderKey: [''],
				SyringeFilter: [''],
				SyringeFilterKey: ['']
			}),
			InstrumentationConditions: this.formBuilder.group({
				InjectionVolume: ['', [Validators.required, Validators.minLength(1)]],
				InjectionUnitKey: ['', [Validators.required]],
				InjectorTemp: [''],
				ColumnTemp: ['', [Validators.required, Validators.minLength(1)]],
				DetectorTemp: [''],
				LCSystemKey: ['', [Validators.required]],
				DetectorTypeKey: ['', [Validators.required]],
				DetectorInstrumentationKey: ['', [Validators.required]],
				Wavelength1: [''],
				Unit1Key: [''],
				Wavelength2: [''],
				Unit2Key: [''],
				IonizationTypeKey: [''],
				Backpressure: ['', [Validators.required]],
				StepLC: this.formBuilder.array([]),
				StepGC: this.formBuilder.array([])
			}),
			AnalyteDetails: this.formBuilder.group({
				MatrixKey: ['', [Validators.required]],
				SamplePreparationKey: ['', [Validators.required]],
				MatrixNotes: [''],
				AnalyteDiluentNotes: [''],
				UploadAnalyteDetails: [''],
				SVGChromatogram: ['', [Validators.required]],
				AnalyteDetailsGrid: this.formBuilder.array([])
			}),
			SamplePrepMethod: this.formBuilder.group({
				ID: [null],
			}),
			DocumentsOfficialMethod: this.formBuilder.group({
				UploadDocument: [null],
				OfficialAgencyKey: [''],
				OfficialMethodNumberKey: ['']
			}),
			CodingRelatedTerms: this.formBuilder.group({
				RelatedTerms: [null],
				RelatedTerm: [''],
				CreativeJobNumbers: [''],
				IndustryKey: ['', [Validators.required]],
				CompoundKey: ['', [Validators.required]]
			}),
			Chromatogram: [null, [Validators.required]]
		});
	}

	private GCFormBuilder() {
		return this.ApplicationForm = this.formBuilder.group({
			ApplicationID: [null],
			Published: [null],
			CreatedBy: [''],
			CreatedOn: [''],
			Reviewer: [null],
			ReviewerEmail: [''],
			StatusKey: [1],
			ApplicationTypeKey: [2],
			Overview: this.formBuilder.group({
				ApplicationTitle: ['', [Validators.required, Validators.minLength(2)]],
				ApplicationReason: [''],
				CustomerThirdPartyDetails: [''],
				SeparationModeKey: ['', [Validators.required]]
			}),
			ColumnDetails: this.formBuilder.group({
				PhenomenexOrCompetitorColumnKey: ['', [Validators.required]],
				PartNumberKey: [''],
				PartNumber: [''],
				Description1: [''],
				Description2: [''],
				CommercialDescription: [''],
				MfgCode: [''],
				BrandCode: [''],
				MfgCodeKey: [''],
				BrandCodeKey: [''],
				Length: ['', [Validators.required]],
				InternalDiameter: ['', [Validators.required]],
				FilmThickness: ['', [Validators.required]],
				SerialNumber: [''],
				BatchNumber: [''],
				ColumnEfficiency: [''],
				InletBaseSeal: [''],
				InletBaseSealKey: [''],
				InletLiner: [''],
				InletLinerKey: [''],
				GuardColumn: [''],
				GuardColumnKey: [''],
				SyringeFilter: [''],
				SyringeFilterKey: ['']
			}),
			InstrumentationConditions: this.formBuilder.group({
				InjectionVolume: ['', [Validators.required, Validators.minLength(1)]],
				InjectionUnitKey: ['', [Validators.required]],
				InjectorTemp: ['', [Validators.required, Validators.minLength(1)]],
				DetectorTemp: [''],
				GCSystemKey: ['', [Validators.required]],
				DetectorTypeKey: ['', [Validators.required]],
				DetectorInstrumentationKey: ['', [Validators.required]],
				DetectorDetail1: [''],
				Unit1Key: [''],
				DetectorDetail2: [''],
				Unit2Key: [''],
				FlowRate: ['', [Validators.required]],
				FlowRateUnitKey: ['', [Validators.required]],
				FlowRateTechniqueKey: ['', [Validators.required]],
				InjectionModeKey: ['', [Validators.required]],
				CarrierGasKey: ['', [Validators.required]],
				SplitRatio: [''],
				SplitlessHoldTime: [''],
				AdditionalDetail: [''],
				StepGC: this.formBuilder.array([]),
				StepLC: this.formBuilder.array([])
			}),
			AnalyteDetails: this.formBuilder.group({
				MatrixKey: ['', [Validators.required]],
				SamplePreparationKey: ['', [Validators.required]],
				MatrixNotes: [''],
				AnalyteDiluentNotes: [''],
				UploadAnalyteDetails: [''],
				SVGChromatogram: ['', [Validators.required]],
				AnalyteDetailsGrid: this.formBuilder.array([])
			}),
			SamplePrepMethod: this.formBuilder.group({
				ID: [null],
			}),
			DocumentsOfficialMethod: this.formBuilder.group({
				UploadDocument: [null],
				OfficialAgencyKey: [''],
				OfficialMethodNumberKey: ['']
			}),
			CodingRelatedTerms: this.formBuilder.group({
				RelatedTerms: [null],
				RelatedTerm: [''],
				CreativeJobNumbers: [''],
				IndustryKey: ['', [Validators.required]],
				CompoundKey: ['', [Validators.required]]
			}),
			Chromatogram: [null, [Validators.required]]
		});
	}

	// Force Submit to insert the fields into the FormGroup of each component
	private post() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.api.put('applications', this.ApplicationForm.getRawValue())
				.subscribe(
					data => {
						this.router.navigate(['./'])
					},
					err => {
						this.errorHandler(err);
					}
				);
		} else {
			this.api.post('applications', this.ApplicationForm.getRawValue())
				.subscribe(
					data => {
						if (this.location.indexOf('form-lc') !== -1) {
							this.router.navigate(['./form-lc/' + data['_body']]);
						} else {
							this.router.navigate(['./form-gc/' + data['_body']]);
						}
					},
					err => {
						this.errorHandler(err);
					}
				);
		}
	}

	private errorHandler(i) {
		this.save = false;
		this.error = 'Error Code: ' + i['status'] + ' - ' + i['statusText'] + '. Please try again later.';
		if (isPlatformBrowser(this.platformId)) {
			window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
		}
	}

	private reqfields() {
		if (this.applicationID !== null) {
			this.ApplicationForm.value.ApplicationID = this.applicationID;
		}

		this.ApplicationForm.value.CreatedOn = this.createdOn;
		this.ApplicationForm.value.ModifiedOn = this.modifiedOn;
	}

	private onSubmit() {
		this.save = true;
		this.reqfields();

		if (this.statusComponent.AnalystDraft === true) {
			this.ApplicationForm.controls['StatusKey'].setValue(2);
		} else if (this.statusComponent.MarketingDraft === true) {
			this.ApplicationForm.controls['StatusKey'].setValue(4);
		} else if (this.statusComponent.ChromatogramUpload === true) {
			this.ApplicationForm.controls['StatusKey'].setValue(6);
		} else if (this.statusComponent.WebApproval === true) {
			this.ApplicationForm.controls['StatusKey'].setValue(7);
			this.ApplicationForm.controls['Reviewer'].setValue('');
		}

		this.post();
		return false;
	}

	// Reject Application
	public rejectApp() {
		this.reject = true;

		this.reqfields();

		if (this.statusComponent.AnalystReview === true) {
			this.ApplicationForm.controls['StatusKey'].setValue(1);
		} else if (this.statusComponent.MarketingReview === true) {
			this.ApplicationForm.controls['StatusKey'].setValue(3);
		} else if (this.statusComponent.WebApproval === true) {
			this.ApplicationForm.controls['StatusKey'].setValue(5);
		}

		this.post();
		return false;
	}

	// Approved Application
	public approveApp() {
		this.approved = true;
		this.reqfields();

		if (this.statusComponent.MarketingReview === true) {
			this.ApplicationForm.controls['StatusKey'].setValue(5);
		}
		if (this.statusComponent.AnalystReview === true) {
			this.ApplicationForm.controls['StatusKey'].setValue(3);
		}

		this.post();
		return false;
	}

	private onSave() {
		this.save = true;
		this.ApplicationForm.value.ApplicationID = this.applicationID;

		this.ApplicationForm.value.CreatedOn = this.createdOn;
		this.ApplicationForm.value.ModifiedOn = this.modifiedOn;

		this.post();
		return true;
	}

	// TOGGLE
	private toggleTabs() {
		if (this.statusComponent.ChromatogramUpload === false) {
			if (!this.overviewComponent.overviewDisabled) {
				this.overviewComponent.overviewOpened = !this.overviewComponent.overviewOpened;
			}
			if (!this.columnDetailsComponent.ColumnDetailsDisabled) {
				this.columnDetailsComponent.ColumnDetailsOpened = !this.columnDetailsComponent.ColumnDetailsOpened;
			}
			if (!this.instrumentationConditionsComponent.InstrumentationConditionsDisabled) {
				this.instrumentationConditionsComponent.InstrumentationConditionsOpened = !this.instrumentationConditionsComponent.InstrumentationConditionsOpened;
			}
			if (!this.analyteDetailsComponent.AnalyteDetailsDisabled) {
				this.analyteDetailsComponent.AnalyteDetailsOpened = !this.analyteDetailsComponent.AnalyteDetailsOpened;
			}
			if (!this.samplePreparationMethodologyComponent.SamplePreparationDisabled) {
				this.samplePreparationMethodologyComponent.SamplePreparationOpened = !this.samplePreparationMethodologyComponent.SamplePreparationOpened;
			}
			if (!this.documentTermsComponent.DocumentTermsDisabled) {
				this.documentTermsComponent.DocumentTermsOpened = !this.documentTermsComponent.DocumentTermsOpened;
			}
		}

		if (this.statusComponent.MarketingDraft === true || this.statusComponent.MarketingReview === true || this.statusComponent.WebApproval === true || this.statusComponent.PHE === true) {
			if (!this.codingRelatedTermsComponent.CodingRelatedTermsDisabled) {
				this.codingRelatedTermsComponent.CodingRelatedTermsOpened = !this.codingRelatedTermsComponent.CodingRelatedTermsOpened;
			}
		}

		if (this.statusComponent.ChromatogramUpload === true || this.statusComponent.WebApproval === true || this.statusComponent.PHE === true) {
			if (!this.chromatogramsComponent.ChromatogramsDisabled) {
				this.chromatogramsComponent.ChromatogramsOpened = !this.chromatogramsComponent.ChromatogramsOpened;
			}
		}
	}

	// Cloning Application
	public cloneApplication() {
		this.ApplicationForm.controls['StatusKey'].setValue(1);
		this.ApplicationForm.controls['ApplicationID'].setValue(null);
		this.ApplicationForm.value.Overview.ApplicationTitle = this.ApplicationForm.value.Overview.ApplicationTitle + '- clone';

		this.api.post('applications', this.ApplicationForm.value)
			.subscribe(res => {
				this.router.navigate(['./']);

				if (isPlatformBrowser(this.platformId)) {
					window.location.reload();
				}
			});
	}

	public roles() {
		this.api.get('user-role-assigned-to.json', 'users/' + this.AS.getTokenDecoded()['sub'])
			.subscribe(r => {
				let roles: Array<object> = [];
				let roleList: Array<string> = [];
				this.permissions = r['Roles'];

				if (this.permissions) {
					let a = this.permissions.map(i => i.Reviewers);
					let b = [].concat.apply([], a);
					b.forEach((i) => {
						let roleObj = {
							ID: i.ID,
							Email: i.Email,
						}
						roles.push(roleObj);
						roleList.push(i.Email);
					})

					this.roleAssignTo = roles;
					this.roleAssignList = roleList;

					this.permissions.forEach((i) => {
						if (i['Delete']) {
							this.delete = i['Delete'];
						}
						if (i['Archive']) {
							this.archive = i['Archive'];
						}
						if (i['Admin']) {
							this.admin = i['Admin'];
						}
					})
				} else {
					// PERMISSIONS
					this.codingRelatedTermsComponent.CodingRelatedTermsDisabled = true;
					this.codingRelatedTermsComponent.CodingRelatedTermsOpened = false;
					this.documentTermsComponent.DocumentTermsDisabled = true;
					this.documentTermsComponent.DocumentTermsOpened = false;
					this.columnDetailsComponent.ColumnDetailsDisabled = true;
					this.columnDetailsComponent.ColumnDetailsOpened = false;
					this.analyteDetailsComponent.AnalyteDetailsDisabled = true;
					this.analyteDetailsComponent.AnalyteDetailsOpened = false;
					this.instrumentationConditionsComponent.InstrumentationConditionsDisabled = true;
					this.instrumentationConditionsComponent.InstrumentationConditionsOpened = false;
					this.samplePreparationMethodologyComponent.SamplePreparationDisabled = true;
					this.samplePreparationMethodologyComponent.SamplePreparationOpened = false;
					this.overviewComponent.overviewDisabled = true;
					this.overviewComponent.overviewOpened = false;
				}
			})
	}

	// Selecting an Assign-To User. Active
	public selectAssignTo(value: string): void {
		this.statusComponent.SendButton = true;
		for (let x of this.roleAssignTo) {
			if (value === x['Email']) {
				this.ApplicationForm.controls['Reviewer'].setValue(x['ID']);
				this.ApplicationForm.controls['ReviewerEmail'].setValue(x['Email']);
				break;
			}
		}
	}

	public updateStatusComponent() {

		if (typeof this.route.snapshot.params.id !== 'undefined') {

			if (this.statusComponent.AnalystDraft === true || this.statusComponent.AnalystReview === true) {
				// DISABLED
				this.codingRelatedTermsComponent.CodingRelatedTermsDisabled = true;
				this.chromatogramsComponent.ChromatogramsDisabled = true;

				// OPENED ACCORDION
				this.overviewComponent.overviewOpened = true;
				this.columnDetailsComponent.ColumnDetailsOpened = true;
				this.instrumentationConditionsComponent.InstrumentationConditionsOpened = true;
				this.analyteDetailsComponent.AnalyteDetailsOpened = true;
				this.samplePreparationMethodologyComponent.SamplePreparationOpened = true;
				this.documentTermsComponent.DocumentTermsOpened = true;

				this.overviewComponent.Opened = true;
				this.columnDetailsComponent.Opened = true;
				this.instrumentationConditionsComponent.Opened = true;
				this.analyteDetailsComponent.Opened = true;
				this.samplePreparationMethodologyComponent.Opened = true;
				this.documentTermsComponent.Opened = true;
			}
		} else {
			if (this.statusComponent.AnalystDraft === true || this.statusComponent.AnalystReview === true) {
				// DISABLED
				this.documentTermsComponent.DocumentTermsDisabled = true;
				this.codingRelatedTermsComponent.CodingRelatedTermsDisabled = true;
				this.chromatogramsComponent.ChromatogramsDisabled = true;
				this.columnDetailsComponent.ColumnDetailsDisabled = true;
				this.instrumentationConditionsComponent.InstrumentationConditionsDisabled = true;
				this.analyteDetailsComponent.AnalyteDetailsDisabled = true;
				this.samplePreparationMethodologyComponent.SamplePreparationDisabled = true;

				// OPENED ACCORDION
				this.overviewComponent.overviewOpened = true;
				this.overviewComponent.Opened = true;
			}
		}

		if (this.statusComponent.MarketingDraft === true || this.statusComponent.MarketingReview === true) {
			// DISABLED
			this.chromatogramsComponent.ChromatogramsDisabled = true;

			// OPENED ACCORDION
			this.overviewComponent.overviewOpened = true;
			this.columnDetailsComponent.ColumnDetailsOpened = true;
			this.instrumentationConditionsComponent.InstrumentationConditionsOpened = true;
			this.analyteDetailsComponent.AnalyteDetailsOpened = true;
			this.samplePreparationMethodologyComponent.SamplePreparationOpened = true;
			this.documentTermsComponent.DocumentTermsOpened = true;
			this.codingRelatedTermsComponent.CodingRelatedTermsOpened = true;

			this.overviewComponent.Opened = true;
			this.columnDetailsComponent.Opened = true;
			this.instrumentationConditionsComponent.Opened = true;
			this.analyteDetailsComponent.Opened = true;
			this.samplePreparationMethodologyComponent.Opened = true;
			this.documentTermsComponent.Opened = true;
			this.codingRelatedTermsComponent.Opened = true;
		}

		if (this.statusComponent.WebApproval === true || this.statusComponent.PHE === true) {
			// OPENED ACCORDION
			this.overviewComponent.overviewOpened = true;
			this.columnDetailsComponent.ColumnDetailsOpened = true;
			this.instrumentationConditionsComponent.InstrumentationConditionsOpened = true;
			this.analyteDetailsComponent.AnalyteDetailsOpened = true;
			this.samplePreparationMethodologyComponent.SamplePreparationOpened = true;
			this.documentTermsComponent.DocumentTermsOpened = true;
			this.codingRelatedTermsComponent.CodingRelatedTermsOpened = true;
			this.chromatogramsComponent.ChromatogramsOpened = true;

			this.overviewComponent.Opened = true;
			this.columnDetailsComponent.Opened = true;
			this.instrumentationConditionsComponent.Opened = true;
			this.analyteDetailsComponent.Opened = true;
			this.samplePreparationMethodologyComponent.Opened = true;
			this.documentTermsComponent.Opened = true;
			this.codingRelatedTermsComponent.Opened = true;
			this.chromatogramsComponent.Opened = true;
		}

		if (this.statusComponent.AnalystDraft === true) {
			this.approve = true;
			this.statusValue = 'Analyst Draft';
		}

		if (this.statusComponent.AnalystReview === true) {
			this.statusValue = 'Analyst Review';
			this.send = false;
		}

		if (this.statusComponent.MarketingDraft === true) {
			this.approve = true;

			this.statusValue = 'Marketing Draft';
		}

		if (this.statusComponent.MarketingReview === true) {
			this.statusValue = 'Marketing Review';
			this.send = false;
		}

		if (this.statusComponent.ChromatogramUpload === true) {
			this.approve = true;
			this.statusValue = 'Chromatogram Upload';

			this.overviewComponent.overviewDisabled = true;
			this.columnDetailsComponent.ColumnDetailsDisabled = true;
			this.instrumentationConditionsComponent.InstrumentationConditionsDisabled = true;
			this.samplePreparationMethodologyComponent.SamplePreparationDisabled = true;
			this.documentTermsComponent.DocumentTermsDisabled = true;
			this.codingRelatedTermsComponent.CodingRelatedTermsDisabled = true;

			// OPENED ACCORDION
			this.analyteDetailsComponent.Opened = true;
			this.analyteDetailsComponent.AnalyteDetailsOpened = true;

			this.chromatogramsComponent.ChromatogramsOpened = true;
			this.chromatogramsComponent.Opened = true;

		}

		if (this.statusComponent.WebApproval === true) {
			this.statusValue = 'Ready for Web Approval';
			this.publish = true;
			this.send = false;
		}

		if (this.statusComponent.PHE === true) {
			this.statusValue = 'On PHE.com';
			this.send = false;
			if (this.statusKey === 8) {
				this.statusComponent.Archive = true;
			}
		}
	}

	finishLoading(a) {
		let b = new AsyncSubject<boolean>();
		b.next(a);
		b.complete();

		let c = b.asObservable()

		c.subscribe((r) => {
			this.output.push(r);

			if (this.output.length === 8) {
				this.done = true;
			}
		})
	}

	deleteApp() {
		this.deleteCount++;
		this.deleteUpdate.emit({
			count: this.deleteCount
		});

		if (this.deleteCount === 1) {
			this.deleteConfirm = true;
		}

		if (this.deleteCount === 2) {
			this.deleteConfirm = false;
			this.deleteDone = true;
			this.api.delete('/applications/' + this.applicationID).subscribe(() => {
				this.router.navigate(['./']);
			});
		}
	}

	hideApp() {
		this.ApplicationForm.controls['StatusKey'].setValue(8);
		this.archiveSpinner = true;

		this.api.put('applications', this.ApplicationForm.value).subscribe(() => {
			if (isPlatformBrowser(this.platformId)) {
				window.location.reload();
			}
		})
	}

	showApp() {
		this.ApplicationForm.controls['StatusKey'].setValue(7);
		this.archiveSpinner = true;

		this.api.put('applications', this.ApplicationForm.value).subscribe(() => {
			if (isPlatformBrowser(this.platformId)) {
				window.location.reload();
			}
		})
	}
}
