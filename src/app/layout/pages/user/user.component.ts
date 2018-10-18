import { Component, OnInit } from '@angular/core';
import { AuthenticationService, API } from '../../../core';

// SSR
import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'phx-user',
	templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {
	public name: string;
	public admin: boolean;

	constructor(@Inject(PLATFORM_ID) private platformId: Object, private AS: AuthenticationService, private api: API) {
		const isLoggedIn = this.AS.isLoggedIn();
		if (isPlatformBrowser(this.platformId)) {
			isLoggedIn.subscribe(loggedin => {
				if (loggedin) {

					let user = this.AS.getTokenDecoded();

					this.api.get('users.json', 'users/' + user.oid).subscribe(r => {

						if (r['Groups'][0]['Name'] === 'Administrator') {
							this.admin = true;
						}
					});
				}
			});
		}
	}

	ngOnInit() {

	}
}
