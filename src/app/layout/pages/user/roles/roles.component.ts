import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// SEO
import { Meta, Title } from '@angular/platform-browser';

import { API, IUser, IRole, AuthenticationService } from '../../../../core/index';

@Component({
	moduleId: module.id,
	selector: 'phx-roles',
	templateUrl: 'roles.component.html'
})

export class RolesComponent implements OnInit {
	public userList: Array<IUser> = [];
	public roleList: Array<IRole> = [];
	public btnSubmit: string;

	public selectedReviewer: number;
	public roleForm: FormGroup;
	public deleteRoleItem: IRole;

	public showForm: boolean;  // show and Hide User Form
	public showConfirm: boolean;
	public checkOverviewRead: boolean;
	public checkOverviewWrite: boolean;
	public checkColumnRead: boolean;
	public checkColumnWrite: boolean;
	public checkInstrRead: boolean;
	public checkInstrWrite: boolean;
	public checkAnalyteRead: boolean;
	public checkAnalyteWrite: boolean;
	public checkSampleRead: boolean;
	public checkSampleWrite: boolean;
	public checkChromRead: boolean;
	public checkChromWrite: boolean;
	public checkDocRead: boolean;
	public checkDocWrite: boolean;
	public checkCodingRead: boolean;
	public checkCodingWrite: boolean;
	public checkPublish: boolean;
	public checkArchive: boolean;
	public checkDelete: boolean;

	constructor(
		meta: Meta,
		title: Title,
		private api: API,
		private fb: FormBuilder,
		private AS: AuthenticationService
	) {
		title.setTitle('App Manager - Roles');
		this.btnSubmit = 'Create';
		this.showForm = false;
		this.showConfirm = false;

		// CREATE the form group
		this.roleForm = this.fb.group({
			Id: [0],
			Name: ['', Validators.required],
			Overview: this.fb.group({
				Read: [''],
				Write: ['']
			}),
			ColumnDetails: this.fb.group({
				Read: [''],
				Write: ['']
			}),
			InstrumentationConditions: this.fb.group({
				Read: [''],
				Write: ['']
			}),
			AnalyteDetails: this.fb.group({
				Read: [''],
				Write: ['']
			}),
			SamplePrepMethod: this.fb.group({
				Read: [''],
				Write: ['']
			}),
			Chromatograms: this.fb.group({
				Read: [''],
				Write: ['']
			}),
			DocumentsRelatedTerms: this.fb.group({
				Read: [''],
				Write: ['']
			}),
			CodingRelatedTerms: this.fb.group({
				Read: [''],
				Write: ['']
			}),
			Publish: [''],
			Archive: [''],
			Delete: [''],
			Reviewers: ['']
		})
	}

	ngOnInit() {
		// TODO: API returns 500
		this.api.get('roles.json', 'roles')
			.subscribe(r => {
				// console.log('GET roles r', r);
				this.roleList = r;
			});

		this.api.get('users.json', 'users')
			.subscribe(r => {
				// console.log('GET users r', r);
				this.userList = r;
			});
	}

	public openForm() {
		this.checkOverviewRead = false;
		this.checkOverviewWrite = false;
		this.checkColumnRead = false;
		this.checkColumnWrite = false;
		this.checkInstrRead = false;
		this.checkInstrWrite = false;
		this.checkAnalyteRead = false;
		this.checkAnalyteWrite = false;
		this.checkSampleRead = false;
		this.checkSampleWrite = false;
		this.checkChromRead = false;
		this.checkChromWrite = false;
		this.checkDocRead = false;
		this.checkDocWrite = false;
		this.checkCodingRead = false;
		this.checkCodingWrite = false;
		this.checkPublish = false;
		this.checkArchive = false;
		this.checkDelete = false;

		this.showForm = !this.showForm;
	}

	// Submitting Form
	public onSubmit(role) {
		let a = role.value

		if (this.btnSubmit === 'Create') {
			this.roleList.push(a);
			this.api.post('roles', a).subscribe();
		} else {
			let b = this.roleList.findIndex(i => i.Id === a.Id);
			this.roleList.splice(b, 1, a);
			this.api.put('roles', a).subscribe();
		}

		this.closeForm();
	}

	public closeForm() {
		this.roleForm.reset();
		this.showForm = !this.showForm;
	}

	public resetForm() {
		this.btnSubmit = 'Create';
		this.showForm = !this.showForm;
		this.roleForm.reset();
	}

	public editRole(roleObj) {
		this.roleForm.controls['Id'].setValue(roleObj.Id);
		this.roleForm.controls['Name'].setValue(roleObj.Name);
		this.selectedReviewer = roleObj.Reviewers;
		this.checkOverviewRead = roleObj.Overview.Read;
		this.checkOverviewWrite = roleObj.Overview.Write;
		this.checkColumnRead = roleObj.ColumnDetails.Read;
		this.checkColumnWrite = roleObj.ColumnDetails.Write;
		this.checkInstrRead = roleObj.InstrumentationConditions.Read;
		this.checkInstrWrite = roleObj.InstrumentationConditions.Write;
		this.checkAnalyteRead = roleObj.AnalyteDetails.Read;
		this.checkAnalyteWrite = roleObj.AnalyteDetails.Write;
		this.checkSampleRead = roleObj.SamplePrepMethod.Read;
		this.checkSampleWrite = roleObj.SamplePrepMethod.Write;
		this.checkChromRead = roleObj.Chromatograms.Read;
		this.checkChromWrite = roleObj.Chromatograms.Write;
		this.checkDocRead = roleObj.DocumentsRelatedTerms.Read;
		this.checkDocWrite = roleObj.DocumentsRelatedTerms.Write;
		this.checkCodingRead = roleObj.CodingRelatedTerms.Read;
		this.checkCodingWrite = roleObj.CodingRelatedTerms.Write;
		this.checkPublish = roleObj.Publish;
		this.checkArchive = roleObj.Archive;
		this.checkDelete = roleObj.Delete;

		this.btnSubmit = 'Update';
		this.showForm = !this.showForm;
	}

	public deleteRole(roleObj) {
		this.showConfirm = true;
		this.deleteRoleItem = roleObj;
	}

	public confirm(status) {
		if (status === 'yes') {
			let b = this.roleList.findIndex(i => i.Id === this.deleteRoleItem.Id);

			this.roleList.splice(b, 1);
			this.api.delete('roles/' + this.deleteRoleItem.Id).subscribe();

		}
		this.showConfirm = false;
		this.deleteRoleItem = null;
	}
}
