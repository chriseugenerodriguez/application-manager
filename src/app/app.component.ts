import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'phx-app',
	templateUrl: './app.component.html'
})
export class AppComponent {

	constructor(public router: Router) {}

}
