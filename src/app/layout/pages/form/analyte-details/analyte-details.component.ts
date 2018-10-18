
import { Component, OnInit, Input, PLATFORM_ID, Inject, Output, EventEmitter } from '@angular/core';
import { FileInfo, FileRestrictions, SuccessEvent, UploadEvent, FileState } from '@progress/kendo-angular-upload';

import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { API, ILookup, AuthenticationService, LookupService } from '../../../../core/index';
import { setTimeout } from 'timers';

import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
	moduleId: module.id,
	selector: 'phx-analyte-details',
	templateUrl: 'analyte-details.component.html'
})
export class AnalyteDetailsComponent implements OnInit {

	// DONE
	@Output() done: EventEmitter<boolean> = new EventEmitter(false);
	finish: boolean = false;

	public permissions: Array<object>;
	public stepControl: any;

	// REACTIVE FORM
	@Input('form') AnalyteDetails: FormGroup;
	@Input('statusComponent') statusComponent: any;
	private stepGrid: Array<object>;

	// ACCORDION
	@Input() Opened: boolean;
	public AnalyteDetailsOpened: boolean;

	public uploadFiles: Array<FileInfo> = [];
	public isValidForm = false;
	public stepRow: number;

	// DISABLED
	public AnalyteDetailsDisabled: boolean;

	// UPLOAD
	UploadCSV = [];
	public uploadcsv: string;
	public uploadsvg: string;
	public uploadRemoveCSV: string;
	public uploadRemoveSVG: string;
	public CSVUploadValue: string;
	private AD = [];
	public pdf: string;

	// Array of objects
	public dataMatrix: Array<ILookup>;
	public dataSamplePreparation: Array<ILookup>;

	// Array of objects
	public Matrix: Array<ILookup>;
	public SamplePreparation: Array<ILookup>;

	// Value of Dropdown List instead of Key-Value
	public matrixKey: number;
	public samplePreparationKey: number;

	public matrixValue: string;
	public samplePreparationValue: string;

	public csvRestrictions: FileRestrictions = {
		allowedExtensions: ['csv']
	};

	public svgRestrictions: FileRestrictions = {
		allowedExtensions: ['pdf']
	};

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		private api: API,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private AS: AuthenticationService,
		private lookupService: LookupService
	) {
		this.stepRow = 0;

	}

	public ngOnInit() {

		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.stepControl = <FormArray>this.AnalyteDetails.controls['AnalyteDetailsGrid'];

			this.loadData().subscribe((r) => {
				this.Matrix = r[0];
				this.dataMatrix = r[0];

				this.SamplePreparation = r[1];
				this.dataSamplePreparation = r[1];

				if (r[2]['AnalyteDetails'].AnalyteDetailsGrid !== null) {
					r[2]['AnalyteDetails'].AnalyteDetailsGrid.forEach((x) => {
						this.stepControl.push(this.CSVGrid(
							x.Peak,
							x.CaseID,
							x.Name,
							x.RT,
							x.Conc,
							x.A,
							x.Rec,
							x.Q1,
							x.Q3
						));
					});
				}

				if (Object.getOwnPropertyNames(r[2]).length !== 0) {
					// Used to determine if new form. Prevent switching to View Mode on form valid
					this.AnalyteDetails.controls['MatrixKey'].setValue(r[2]['AnalyteDetails'].MatrixKey);
					this.matrixKey = r[2]['AnalyteDetails'].MatrixKey;
					if (this.matrixKey) {
						this.matrixValue = this.lookupService.lookupKeyValue(this.Matrix, r[2]['AnalyteDetails'].MatrixKey);
					}

					this.AnalyteDetails.controls['MatrixNotes'].setValue(r[2]['AnalyteDetails'].MatrixNotes);

					this.AnalyteDetails.controls['SamplePreparationKey'].setValue(r[2]['AnalyteDetails'].SamplePreparationKey);
					this.samplePreparationKey = r[2]['AnalyteDetails'].SamplePreparationKey;

					if (this.samplePreparationValue) {
						this.samplePreparationValue = this.lookupService.lookupKeyValue(this.SamplePreparation, r[2]['AnalyteDetails'].SamplePreparationKey);
					}

					this.AnalyteDetails.controls['AnalyteDiluentNotes'].setValue(r[2]['AnalyteDetails'].AnalyteDiluentNotes);

					//	this.AnalyteDetails.controls['AnalyteDetailsGrid'].setValue(r[2]['AnalyteDetails'].AnalyteDetailsGrid);
				}
				this.AnalyteDetails.controls['SVGChromatogram'].setValue(r[2]['AnalyteDetails'].SVGChromatogram);
				this.uploadFiles = r[2]['AnalyteDetails'].SVGChromatogram;
				if (this.uploadFiles.length !== 0) {
					this.pdf = this.uploadFiles[0]['url'];
				}

				this.AS.isLoggedIn().subscribe(loggedin => {
					if (loggedin) {
						this.permission();
					}
				});
			});
		}
		this.enabled();
	}

	public permission() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.api.get('user-role-assigned-to.json', 'users/' + this.AS.getTokenDecoded()['sub']).subscribe(r => {
				this.permissions = r;

				for (let x = 0; x < this.permissions['Roles'].length; x++) {
					let c = this.permissions['Roles'][x].AnalyteDetails;

					if (!this.statusComponent.PHE) {
						if (c.Read === false && c.Write === false) {
							this.AnalyteDetailsDisabled = true;
							this.AnalyteDetailsOpened = false;
						}
						if (c.Read === true && c.Write === false) {
							this.AnalyteDetails.disable();
						}
						if (c.Read === false && c.Write === true || c.Read === true && c.Write === true) {
							this.AnalyteDetails.enable();
						}
					}
				}

				let b;
				for (let x = 0; x < this.permissions.length; x++) {
					if (x['Admin']) {
						b = x['Admin'];
					}
					if (b === true) {
						this.AnalyteDetails.enable();
					} else {
						this.AnalyteDetails.disable();
					}
				}

				this.done.emit(true);
				this.finish = true;
			})
		}
	}

	public uploadCSVEvent(e: UploadEvent) {
		e.headers = e.headers.append('Authorization', 'Bearer ' + this.AS.getToken());
	}

	// Response from a success CSV Success
	public uploadCSVSuccess(e: SuccessEvent) {
		let r = e.response;

		while (this.stepControl.length) {
			this.stepControl.removeAt(0);
		}

		r['body'].forEach((x) => {
			this.stepControl.push(this.CSVGrid(
				x.Peak,
				x.CaseID,
				x.Name,
				x.RT,
				x.Conc,
				x.A,
				x.Rec,
				x.Q1,
				x.Q3
			));
		});
	}

	public uploadPDFEvent(e: UploadEvent) {
		let l = e.files;
		setTimeout(() => {
			this.pdf = 'https://phxappmanagerblob.blob.core.windows.net/chromatograms/' + l[0].uid + '.pdf';
		}, 1000);
		e.headers = e.headers.append('x-fileid', l[0].uid);
		e.headers = e.headers.append('x-fileid-size', JSON.stringify(l[0].size));
		e.headers = e.headers.append('Authorization', 'Bearer ' + this.AS.getToken());

		let up = {
			extension: l['extension'],
			name: l['rawFile'].name,
			size: l['size'],
			uid: l['uid'],
			url: 'https://phxappmanagerblob.blob.core.windows.net/chromatograms/' + l['uid'] + l['extension']
		};
		this.uploadFiles.push(up);

		this.AnalyteDetails.controls['SVGChromatogram'].setValue(this.uploadFiles);
	}

	public removeUploadFile(upload, uid: string) {
		for (let x of this.uploadFiles) {
			if (x.uid === uid) {
				this.uploadFiles.splice(this.uploadFiles.indexOf(x), 1);
				break;
			}
		}
		this.AnalyteDetails.controls['SVGChromatogram'].setValue(this.uploadFiles);
		this.pdf = null;
	}

	public format(state: FileState): boolean {
		return (state === FileState.Uploaded || state === 1) ? true : false;
	}

	public download(b) {
		if (isPlatformBrowser(this.platformId)) {
			window.open('https://phxappmanagerblob.blob.core.windows.net/chromatograms/' + b['uid'] + b['extension'], '_blank');
		}
	}

	public filterChangeMatrix(val) {
		this.dataMatrix = this.Matrix.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterChangeSamplePreparation(val) {
		this.dataSamplePreparation = this.SamplePreparation.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	loadData(): Observable<any[]> {
		let r0 = this.api.get('lookup-matrix.json', 'lookups/Matrix');
		let r1 = this.api.get('lookup-sample-preparation.json', 'lookups/SamplePreparation');
		let r2 = this.api.get('application.json', 'applications/' + this.route.snapshot.params.id);

		return Observable.forkJoin([r0, r1, r2])
	}

	enabled() {
		// this is where its calling applications, multiple times, needs to be updated
		if (typeof this.route.snapshot.params.id !== 'undefined') {

			this.AnalyteDetails.controls['UploadAnalyteDetails'].enable();
			this.AnalyteDetails.controls['SVGChromatogram'].enable();

			this.uploadcsv = this.api.apibase + 'applications/' + this.route.snapshot.params.id + '/upload/analytecsv';
			this.uploadRemoveCSV = '';
			this.uploadsvg = this.api.apibase + 'applications/' + this.route.snapshot.params.id + '/upload/chromatograms';
			this.uploadRemoveSVG = this.api.apibase + 'applications/' + this.route.snapshot.params.id + '/upload/chromatograms';
		} else {
			this.AnalyteDetails.controls['UploadAnalyteDetails'].disable();
			this.AnalyteDetails.controls['SVGChromatogram'].disable();
		}
	}

	// Create new sample step. Optional parameters passed
	private CSVGrid(peak?: string, caseid?: string, name?: string, rt?: string, conc?: string, a?: string, req?: string, q1?: string, q3?: string) {
		return this.fb.group({
			Peak: [peak],
			CaseID: [caseid],
			Name: [name],
			RT: [rt],
			Conc: [conc],
			A: [a],
			Rec: [req],
			Q1: [q1],
			Q3: [q3]
		})
	}

}
