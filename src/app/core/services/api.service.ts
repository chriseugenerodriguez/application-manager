import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { toDataSourceRequestString, translateDataSourceResultGroups, translateAggregateResults, DataResult, DataSourceRequestState} from '@progress/kendo-data-query';

export let api = '';
export let localbase = 'assets/json/';

// AUTH HEADERS
import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class API {
	headers = new Headers;
	options = new RequestOptions;
	apibase = 'https://phx-appmanager-api-dev.azurewebsites.net/phenomenex/appManager/1.0.0/';

	constructor(private http: Http, private AS: AuthenticationService) {
		this.headers = new Headers({'content-type': 'application/json', 'Authorization': 'Bearer ' + this.AS.getToken()});
		this.options = new RequestOptions({ headers: this.headers});
	}

	public get (localfile: string, apiname: string, state?: DataSourceRequestState): Observable<any[]> {
		if (state != null /*&& environment.production*/) {
			const queryStr = `${toDataSourceRequestString(state)}`; // Serialize the state
			const hasGroups = state.group && state.group.length;

			api = this.apibase + apiname + '?' + queryStr;

			return this.http
					.get(api, this.options) // Send the state to the server
					.map(response => response.json())
					.map(({data, total, aggregateResults}) => // Process the response
							(<any>{
									// If there are groups, convert them to a compatible format
									data: hasGroups ? translateDataSourceResultGroups(data) : data,
									total: total,
									// Convert the aggregates if such exist
									aggregateResult: translateAggregateResults(aggregateResults)

							})
					)
		} else {
			// if (environment.production) {
				api = this.apibase + apiname
				// } else {
				// api = localbase + localfile;
				// }
			return this.http.get(api, this.options)
				.map((r: Response) => r.json())
				.catch(this._errorHandler);
		}
	}

	// COMMANDS (SUBMIT, SAVE, ETC.)
	public post(apiname: string, data?: any) {
		const body = JSON.stringify(data);

		// if (environment.production) {
			api = this.apibase + apiname;
		// } else {
		// 	api = localbase;
		// }

		return this.http.post(api, body, this.options )
			.map((res: Response) => res)
			.catch(this._errorHandler)
		// 	.subscribe();
	}

	// UPDATE (change value in object)
	public put(apiname: string, data?: any) {
		const body = JSON.stringify(data);

		// if (environment.production) {
			api = this.apibase + apiname;
		// } else {
		// 	api = localbase;
		// }

		return this.http.put(api, body, this.options )
			.map((res: Response) => res)
			.catch(this._errorHandler)
			// .subscribe();
	}

	public delete(apiname: string, data?: any) {
		const body = JSON.stringify(data);

		// if (environment.production) {
			api = this.apibase + apiname;
		// } else {
		// 	api = localbase;
		// }

		return this.http.delete(api, this.options)
			.map((res: Response) => res)
			.catch(this._errorHandler)
	}

	private _errorHandler(error: Response) {
		console.error('error', error);
		return Observable.throw(error || 'Server Error');
	}
}
