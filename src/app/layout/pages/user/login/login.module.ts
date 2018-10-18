import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// RELATED
import { LoginComponent } from './login.component';

// PROVIDERS
import { AuthenticationService } from '../../../../core/index';


// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
	],
	declarations: [
		LoginComponent
	],
	exports: [
		LoginComponent,
		FormsModule,
		RouterModule,
	],
	providers: [
		AuthenticationService
	]
})
export class LoginModule { }
