import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// SEO
import { Meta, Title } from '@angular/platform-browser';

import { API, IUser, IRole } from '../../../../core/index';

import 'rxjs/add/operator/filter';

@Component({
	moduleId: module.id,
	selector: 'phx-users',
	templateUrl: 'users.component.html'
})

export class UsersComponent implements OnInit {

	public usersRolesList: Array<any> = [];
	public dataUsersFiltered: Array<any> = [];
	public dataUsers: Array<{ 'ID': string, 'Email': string }> = [];
	public dataRoles: Array<{ 'ID': number, 'Name': string }> = [];
	public selectedUserItem: { 'ID': string, 'Email': string };
	public selectedRoleItems: Array<any> = [];

	public userForm: FormGroup;
	public btnName: string;
	public showUserForm: boolean;  // show and Hide User Form
	public showConfirm: boolean;
	public deleteUserItem: IUser;

	constructor(meta: Meta, title: Title, private api: API, private fb: FormBuilder) {
		this.userForm = this.fb.group({
			User: ['', Validators.required],
			Roles: ['', Validators.required]
		});

		title.setTitle('App Manager - Users');
		this.btnName = 'Create';
		this.showUserForm = false;
		this.showConfirm = false;
	}

	ngOnInit() {
		this.api.get('users-roles.json', 'users/roles')
			.subscribe(r => {
				// console.log('users/roles r', r);
				this.usersRolesList = r;
			});

		this.api.get('roles.json', 'roles')
			.subscribe(r => {
				// console.log('roles r', r);
				this.dataRoles = r;
			});

		this.api.get('users.json', 'users')
			.subscribe(r => {
				// console.log('users r', r);
				this.dataUsers = r;
				this.dataUsersFiltered = r
			});
	}


	public resetForm() {
		this.showUserForm = !this.showUserForm;
		this.deleteUserItem = null;
		this.selectedUserItem = null;
		this.selectedRoleItems = null;
		this.btnName = 'Create';

		this.userForm.controls['User'].enable();
	}

	// Open User Form
	public openUserForm() {
		this.resetForm();

		this.dataUsersFiltered = [];
		let found: boolean;

		// Loop through available users and compare already created user. If no match, push to dataUsersFilterd Object to be displayed
		for (const user of this.dataUsers) {
			found = false;
			for (const ur of this.usersRolesList) {
				if (user.ID === ur['User'].ID) {
					found = true;
					break;
				}
			}
			if (found !== true) {
				this.dataUsersFiltered.push(user);
			}
		}
	}

	public closeForm() {
		this.resetForm();
	}

	// TODO: Verify POST API works
	public onSubmit() {
		let roles = [];
		let tempRoles = [];
		let id = this.userForm.value.Roles;

		id.forEach(function (x) {
			roles.push(x['Id']);
			tempRoles.push({ Id: x['Id'], Name: x['Name'] })
		})

		if (this.btnName === 'Create') {
			const usersRoleObj = this.userForm.value;
			this.usersRolesList.push(usersRoleObj);
			// console.log(usersRoleObj);
			this.api.post('users/' + usersRoleObj['User']['ID'] + '/roles/', roles)
				.subscribe();
		} else {

			// Create a new UserRole Object
			const tempUserRole = {
				User: this.selectedUserItem,
				Roles: tempRoles
			}
			console.log(this.selectedUserItem);

			for (const userRole of this.usersRolesList) {
				if (userRole['User'].ID === this.selectedUserItem.ID) {
					this.usersRolesList.splice(this.usersRolesList.indexOf(userRole), 1, tempUserRole);
					this.api.post('users/' + this.selectedUserItem['ID'] + '/roles/', roles)
						.subscribe();
					break;
				}
			}
		}

		this.userForm.reset();
		this.resetForm();
	}

	// Passing user object to edit. JSON.parse(JSON.stringify(this.dataUsers) to prevent overwriting the original dataUsers
	public editUser(userObj) {
		this.dataUsersFiltered = <any>JSON.parse(JSON.stringify(this.dataUsers));
		this.showUserForm = !this.showUserForm;
		this.btnName = 'Update';

		// dataUsersFiltered IDs are lowercase. Need to convert userObj ID to lowercase 
		this.selectedUserItem = { ID: userObj.User.ID.toLowerCase(), Email: userObj.User.Email };
		this.userForm.controls['User'].disable();
		this.selectedRoleItems = userObj.Roles;
		console.log(userObj.Roles);
	}

	public deleteUser(userObj) {
		this.showConfirm = true;
		this.deleteUserItem = userObj;
	}

	// Delete User
	public confirm(status) {
		if (status === 'yes') {
			for (const userRole of this.usersRolesList) {
				if (userRole['User'].ID === this.deleteUserItem['User'].ID) {
					this.usersRolesList.splice(this.usersRolesList.indexOf(userRole), 1);
					this.api.delete('users/' + userRole['User']['ID'] + '/roles', userRole['User']['ID']).subscribe();
					break;
				}
			}
		}

		this.showConfirm = false;
		this.deleteUserItem = null;
	}
}
