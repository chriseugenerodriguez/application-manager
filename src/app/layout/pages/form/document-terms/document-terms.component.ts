import { Component, OnInit, Input, PLATFORM_ID, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { API, ILookup, AuthenticationService, LookupService } from '../../../../core/index';
import { ActivatedRoute } from '@angular/router';

import { SuccessEvent, UploadEvent, FileInfo, FileState } from '@progress/kendo-angular-upload';

import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';


@Component({
	moduleId: module.id,
	selector: 'phx-document-terms',
	templateUrl: 'document-terms.component.html'
})

export class DocumentTermsComponent implements OnInit {

	// DONE
	@Output() done: EventEmitter<boolean> = new EventEmitter(false);
	finish: boolean = false;

	public permissions: Array<object>;
	public uploadFiles: Array<FileInfo> = [];

	// Filter for combobox
	public dataOfficialAgency: Array<ILookup>;
	public dataOfficialMethodNumber: Array<ILookup>;

	// Chained Combobox
	public OfficialAgency: Array<ILookup>;
	public OfficialMethodNumber: Array<ILookup>;

	public officialAgencyValue: string;
	public officialMethodNumberValue: string;

	public officialAgencyKey: number;
	public officialMethodNumberKey: number;

	selectedAgency: any;

	// ACCORDION
	@Input() Opened: boolean;
	DocumentTermsOpened: boolean;

	// DISABLED
	DocumentTermsDisabled: boolean;

	// REACTIVE FORM
	@Input('form') DocumentsOfficialMethod: FormGroup;
	@Input() UploadDocument: object;
	@Input('statusComponent') statusComponent: any;

	// UPLOAD
	uploadSaveUrl: string;
	uploadRemoveUrl: string;

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		public api: API,
		private route: ActivatedRoute,
		private AS: AuthenticationService,
		private lookupService: LookupService
	) {
	}

	ngOnInit() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.uploadSaveUrl = this.api.apibase + 'applications/' + this.route.snapshot.params.id + '/upload/document';
			this.uploadRemoveUrl = this.api.apibase + 'applications/' + this.route.snapshot.params.id + '/upload/document/';

			this.loadData().subscribe((r) => {
				this.OfficialAgency = r[0];
				this.dataOfficialAgency = r[0].slice();

				this.DocumentsOfficialMethod.controls['OfficialAgencyKey'].setValue(r[1]['DocumentsOfficialMethod'].OfficialAgencyKey);
				this.officialAgencyKey = r[1]['DocumentsOfficialMethod'].OfficialAgencyKey;
				this.officialAgencyValue = this.lookupService.lookupKeyValue(this.OfficialAgency, this.officialAgencyKey);

				this.DocumentsOfficialMethod.controls['UploadDocument'].setValue(r[1]['DocumentsOfficialMethod'].UploadDocument);
				this.uploadFiles = r[1]['DocumentsOfficialMethod'].UploadDocument;

				this.DocumentsOfficialMethod.controls['OfficialMethodNumberKey'].setValue(r[1]['DocumentsOfficialMethod'].OfficialMethodNumberKey);
				this.officialMethodNumberKey = r[1]['DocumentsOfficialMethod'].OfficialMethodNumberKey;

				if (r[1]['DocumentsOfficialMethod'].OfficialMethodNumberKey !== null) {
					this.api.get('lookup-official-method-number.json', 'lookups/OfficialMethodNumber/' + this.officialAgencyKey)
						.subscribe(re => {
							this.OfficialMethodNumber = re;
							this.dataOfficialMethodNumber = re.slice();
							this.officialMethodNumberValue = this.lookupService.lookupKeyValue(this.OfficialMethodNumber, this.officialMethodNumberKey);
						})
				}

				this.AS.isLoggedIn().subscribe(loggedin => {
					if (loggedin) {
						this.permission();
					}
				});
			});
		};
	}

	loadData(): Observable<any[]> {
		let r0 = this.api.get('lookup-official-agency.json', 'lookups/OfficialAgency');
		let r1 = this.api.get('application.json', 'applications/' + this.route.snapshot.params.id);

		return Observable.forkJoin([r0, r1])
	}

	public permission() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.api.get('user-role-assigned-to.json', 'users/' + this.AS.getTokenDecoded()['sub']).subscribe(r => {
				this.permissions = r;

				for (let x = 0; x < this.permissions['Roles'].length; x++) {
					let c = this.permissions['Roles'][x].DocumentsRelatedTerms;

					if (!this.statusComponent.PHE) {
						if (c.Read === false && c.Write === false) {
							this.DocumentTermsDisabled = true;
							this.DocumentTermsOpened = false;
						}
						if (c.Read === true && c.Write === false) {
							this.DocumentsOfficialMethod.disable();
						}
						if (c.Read === false && c.Write === true || c.Read === true && c.Write === true) {
							this.DocumentsOfficialMethod.enable();
						}
					}
				}

				let b;
				for (let x = 0; x < this.permissions.length; x++) {
					if (x['Admin']) {
						b = x['Admin'];
					}
					if (b === true) {
						this.DocumentsOfficialMethod.enable();
					} else {
						this.DocumentsOfficialMethod.disable();
					}
				}

				this.done.emit(true);
				this.finish = true;
			})
		}
	}

	public uploadEvent(e: UploadEvent) {
		let l = e.files;
		e.headers = e.headers.append('x-fileid', l[0].uid);
		e.headers = e.headers.append('x-fileid-size', JSON.stringify(l[0].size));
		e.headers = e.headers.append('Authorization', 'Bearer ' + this.AS.getToken());

		let up = {
			extension: l['extension'],
			name: l['rawFile'].name,
			size: l['size'],
			uid: l['uid'],
			url: 'https://phxappmanagerblob.blob.core.windows.net/documents/' + l['uid'] + l['extension']
		};
		this.uploadFiles.push(up);

		this.DocumentsOfficialMethod.controls['UploadDocument'].setValue(this.uploadFiles);
	}

	public removeUploadFile(upload, uid: string) {
		for (let x of this.uploadFiles) {
			if (x.uid === uid) {
				this.uploadFiles.splice(this.uploadFiles.indexOf(x), 1);
				break;
			}
		}
		this.DocumentsOfficialMethod.controls['UploadDocument'].setValue(this.uploadFiles);
	}

	public format(state: FileState): boolean {
		return (state === FileState.Uploaded || state === 1) ? true : false;
	}

	public download(b) {
		if (isPlatformBrowser(this.platformId)) {
			window.open('https://phxappmanagerblob.blob.core.windows.net/documents/' + b['uid'] + b['extension'], '_blank');
		}
	}

	public OfficalAgencyChange(val) {
		if (typeof val === 'undefined') {
			this.officialMethodNumberKey = null;
			this.DocumentsOfficialMethod.controls['OfficialMethodNumberKey'].disable();
			this.OfficialMethodNumber = [];
		} else {
			this.DocumentsOfficialMethod.controls['OfficialMethodNumberKey'].enable();

			this.api.get('lookup-official-method-number.json', 'lookups/OfficialMethodNumber/' + val)
				.subscribe(r => {
					this.OfficialMethodNumber = r;
					this.dataOfficialMethodNumber = r.slice();
				})
		}
	}

	public filterOfficialAgency(val) {
		this.dataOfficialAgency = this.OfficialAgency.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}

	public filterOfficialMethodNumber(val) {
		this.dataOfficialMethodNumber = this.OfficialMethodNumber.filter((s) => s.Value.toLowerCase().indexOf(val.toLowerCase()) !== -1);
	}
}
