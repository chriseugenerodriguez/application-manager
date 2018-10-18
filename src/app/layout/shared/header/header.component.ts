import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';

// SERVICES
import { AuthenticationService, API } from '../../../core/index';

// SSR
import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { RoutesRecognized, Router } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'phx-header',
	templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit {
	name: string;
	admin: boolean;

	constructor(@Inject(PLATFORM_ID) private platformId: Object, private AS: AuthenticationService, private api: API, private router: Router) {
		const isLoggedIn = this.AS.isLoggedIn();
		if (isPlatformBrowser(this.platformId)) {
			isLoggedIn.subscribe(res => {
				if (res) {
					let user = this.AS.getTokenDecoded();

					this.api.get('users.json', 'users/' + user.oid).subscribe(r => {
						this.name = r['Email'];
						if (r['Groups'].length) {
							if ( r['Groups'][0]['Name'] === 'Administrator') {
								this.admin = true;
							}
						}
					});
				}
			});
		}
	}

	logOut() {
		this.AS.logOut();
	}

	ngOnInit() {
		// Reload callback for login
		if (isPlatformBrowser(this.platformId)) {
			this.router.events.filter(e => e instanceof RoutesRecognized)
			.pairwise().subscribe((e) => {
				if (e[0]['url'].match('/login') && e[1]['url'] === '/') {
					window.location.reload();
				}
			});
		}
	}

}
