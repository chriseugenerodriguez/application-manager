import { Component } from '@angular/core';
import { Router } from '@angular/router';

// SEO
import { Meta, Title } from '@angular/platform-browser';

import { AuthenticationService } from '../../../../core/index';

// SSR
import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';


@Component({
	selector: 'phx-login',
	templateUrl: 'login.component.html'
})

export class LoginComponent {

	constructor(@Inject(PLATFORM_ID) private platformId: Object, title: Title, private AS: AuthenticationService, private router: Router) {
		title.setTitle('App Manager - Login');

		const token: string = this.AS.getToken();
		if (token == null || token === undefined || token === 'null' || token === '') {

			if (isPlatformBrowser(this.platformId)) {
				const urlParams = new URLSearchParams(window.location.hash);

				// Setting token in session storage to prevent immediate multiple redirection to AAD login.
				if (urlParams.get('id_token') !== null || urlParams.get('id_token') !== undefined) {
					window.sessionStorage.setItem('msal.idtoken', urlParams.get('id_token'));
				}
			}
			this.router.navigate(['']);
		} else {
			this.router.navigate(['']);
		}
	}
}
