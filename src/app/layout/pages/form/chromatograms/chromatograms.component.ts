
import { Component, OnInit, Input, PLATFORM_ID, Inject, Output, EventEmitter } from '@angular/core';
import { FileInfo, FileRestrictions, UploadEvent, FileState } from '@progress/kendo-angular-upload';

import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { API } from '../../../../core';
import { AuthenticationService } from 'app/core/services/auth.service';


import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Component({
	moduleId: module.id,
	selector: 'phx-chromatograms',
	templateUrl: 'chromatograms.component.html'
})
export class ChromatogramsComponent implements OnInit {

	// DONE
	@Output() done: EventEmitter<boolean> = new EventEmitter(false);
	finish: boolean = false;

	public permissions: Array<object>;
	public uploadFiles: Array<FileInfo> = [];

	// ACCORDION
	@Input() Opened: boolean;
	ChromatogramsOpened: boolean;

	// DISABLED
	ChromatogramsDisabled: boolean;
	@Input('statusComponent') statusComponent: any;

	public chromatogramValue: string;

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		private route: ActivatedRoute,
		public api: API,
		private AS: AuthenticationService
	) {
	}

	// REACTIVE FORM
	@Input('form') ApplicationForm: FormGroup;

	// UPLOAD
	uploadSaveUrl: string;
	uploadRemoveUrl: string;

	public imgRestrictions: FileRestrictions = {
		allowedExtensions: ['.svg']
	};

	ngOnInit() {

		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.uploadSaveUrl = this.api.apibase + 'applications/' + this.route.snapshot.params.id + '/upload/chromatograms';
			this.uploadRemoveUrl = this.api.apibase + 'applications/' + this.route.snapshot.params.id + '/upload/chromatograms';

			this.loadData().subscribe(r => {
				if (r[0]['Chromatogram'].length !== 0) {
					this.uploadFiles = r[0]['Chromatogram'];
				}

				this.AS.isLoggedIn().subscribe(loggedin => {
					if (loggedin) {
						this.permission();
					}
				});
			});
		}
	}

	loadData(): Observable<any[]> {
		let r0 = this.api.get('application.json', 'applications/' + this.route.snapshot.params.id);

		return Observable.forkJoin([r0]);
	}

	public permission() {
		if (typeof this.route.snapshot.params.id !== 'undefined') {
			this.api.get('user-role-assigned-to.json', 'users/' + this.AS.getTokenDecoded()['sub']).subscribe(r => {
				this.permissions = r;

				for (let x = 0; x < this.permissions['Roles'].length; x++) {
					let c = this.permissions['Roles'][x].Chromatograms;

					if (!this.statusComponent.PHE) {
						if (c.Read === false && c.Write === false) {
							this.ChromatogramsDisabled = true;
							this.ChromatogramsOpened = false;
						}
						if (c.Read === true && c.Write === false) {
							this.ApplicationForm.controls['Chromatogram'].disable();
						}
						if (c.Read === false && c.Write === true || c.Read === true && c.Write === true) {
							this.ApplicationForm.controls['Chromatogram'].enable();
						}
					}
				}

				let b;
				for (let x = 0; x < this.permissions.length; x++) {
					if (x['Admin']) {
						b = x['Admin'];
					}
					if (b === true) {
						this.ApplicationForm.controls['Chromatogram'].enable();
					} else {
						this.ApplicationForm.controls['Chromatogram'].disable();
					}
				}

				this.done.emit(true);
				this.finish = true;
			})
		}
	}

	public uploadEvent(e: UploadEvent) {
		let l = e.files[0];
		e.headers = e.headers.append('x-fileid', l['uid']);
		e.headers = e.headers.append('x-fileid-size', JSON.stringify(l['size']));
		e.headers = e.headers.append('Authorization', 'Bearer ' + this.AS.getToken());

		let up = {
			extension: l['extension'],
			name: l['rawFile'].name,
			size: l['size'],
			uid: l['uid'],
			url: 'https://phxappmanagerblob.blob.core.windows.net/chromatograms/' + l['uid'] + l['extension']
		};
		this.uploadFiles.push(up);

		this.ApplicationForm.controls['Chromatogram'].setValue(this.uploadFiles);
	}

	public removeUploadFile(upload, uid: string) {
		for (let x of this.uploadFiles) {
			if (x.uid === uid) {
				this.uploadFiles.splice(this.uploadFiles.indexOf(x), 1);
				break;
			}
		}

		this.ApplicationForm.controls['Chromatogram'].setValue(this.uploadFiles);
		this.ApplicationForm.controls['Chromatogram'].markAsDirty();
	}

	public format(state: FileState): boolean {
		return (state === FileState.Uploaded || state === 1) ? true : false;
	}

	public download(b) {
		if (isPlatformBrowser(this.platformId)) {
			window.open('https://phxappmanagerblob.blob.core.windows.net/chromatograms/' + b['uid'] + b['extension'], '_blank');
		}
	}

}
