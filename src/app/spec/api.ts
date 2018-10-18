import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class APIService {
	constructor(private http: Http) {
	}

	get(type: string, param?: string) {
		let url = 'https://phx-appmanager-api-dev.azurewebsites.net/phenomenex/appManager/1.0.0/';
		return this.http
			.get(url + '/' + type + '/' + param);
	}

}
