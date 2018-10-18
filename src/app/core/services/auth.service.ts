import { JwtHelper } from 'angular2-jwt';
import { HttpRequest } from '@angular/common/http';
import { UserAgentApplication } from 'msalx';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';

// SSR
import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

@Injectable()
export class AuthenticationService {
	accessToken: string;
	userAgentApplication: UserAgentApplication = null;

	public url = environment.production ? 'https://appmngerdev.azurewebsites.net' : 'http://localhost:4200';

	private applicationConfig: any = {
		clientID: '1ea86d94-ccc0-414f-88e2-7508276ea288',
		authority: 'https://login.microsoftonline.com/tfp/phenomenexb2c.onmicrosoft.com/B2C_1_PhxSignUpSignIn',
		b2cScopes: ['https://PhenomenexB2C.onmicrosoft.com/user_impersonation'],
		passwordReset: 'https://login.microsoftonline.com/tfp/phenomenexb2c.onmicrosoft.com/B2C_1_PhxPwdPolicy',
		hostname: this.url
	};


	constructor(@Inject(PLATFORM_ID) private platformId: Object, public jwtHelper: JwtHelper) {

		if (isPlatformBrowser(this.platformId)) {
			this.userAgentApplication = new UserAgentApplication(
				this.applicationConfig.clientID,
				this.applicationConfig.authority,
				this._onTokenCallback, {
					redirectUri: this.applicationConfig.hostname + '/login',
					postLogoutRedirectUri: this.applicationConfig.hostname
				}
			);
		};
	}

	public login() {
		if (isPlatformBrowser(this.platformId)) {
			this.userAgentApplication.loginRedirect(this.applicationConfig.b2cScopes)
		}
	}

	public isLoggedIn(): Observable<boolean> {
		if (isPlatformBrowser(this.platformId)) {
			const token = this.getToken();
			if (token == null || token === undefined || token === 'null' || token === '' || this.jwtHelper.isTokenExpired(token)) {
				return Observable.of(false);
			}
		}

		return Observable.of(true);
	}

	public logOut() {
		if (isPlatformBrowser(this.platformId)) {
			this.userAgentApplication.logout();
		}
	}

	public getToken(): string {
		let token: string;

		if (isPlatformBrowser(this.platformId)) {
			token = window.sessionStorage.getItem('msal.idtoken');
		}

		return token;
	}

	public getTokenDecoded(): any {
		if (isPlatformBrowser(this.platformId)) {
			return this.jwtHelper.decodeToken(this.getToken());
		}
	}

	private _onTokenCallback = (errorDesc: any, token: any, error: any, tokenType: any) => {
		if (token) {
				this.accessToken = token;
			}
			if (errorDesc) {
				if (errorDesc.indexOf('AADB2C90118') > -1) {
					//  forgot
					console.log(errorDesc);
					this.userAgentApplication = new UserAgentApplication(
						this.applicationConfig.clientID,
						this.applicationConfig.passwordReset,
						this._onTokenCallback
					);
					this.login();
				}
			}
 }
}
