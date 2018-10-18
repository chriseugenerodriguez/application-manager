import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './auth.service';
import { Injectable } from '@angular/core';

import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthGuardService implements CanActivate {
	isAuthenticated: boolean;

	constructor(private AS: AuthenticationService, private router: Router, public jwtHelper: JwtHelper) {
		this.isAuthenticated = false;
	}

	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

		const token: string = this.AS.getToken();
		if (token == null || token === undefined || token === 'null' || token === '' || this.jwtHelper.isTokenExpired(token)) {
			this.isAuthenticated = false;
			this.AS.login();
		} else {
			this.isAuthenticated = true;
		}
		return this.isAuthenticated;
	}
}
