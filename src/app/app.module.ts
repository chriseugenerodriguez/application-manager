import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// PAGES
import { ApplicationsModule, FormModule, NotFoundModule, SamplePrepModule, UserModule, LoginModule } from './layout/pages/index'

// SHARED
import { HeaderModule } from './layout/shared/index'

// PROVIDERS
import { AuthenticationService, API, LookupService, AuthGuardService } from './core/index';

// Import the Animations module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TransferHttpCacheModule } from '@nguniversal/common';
import { JwtHelper } from 'angular2-jwt';
import { HttpClientModule } from '../../node_modules/@angular/common/http';

// HASH LOCATION STRATEGY
const routes: Routes = [];

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'a' }),
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		HttpModule,
		TransferHttpCacheModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		RouterModule.forRoot(routes),

		// PAGES
		ApplicationsModule,
		FormModule,
		SamplePrepModule,
		UserModule,
		LoginModule,
		NotFoundModule,

		// SHARED
		HeaderModule
	],
	providers: [
		AuthGuardService,
		JwtHelper,
		AuthenticationService,
		API,
		LookupService
	],
	bootstrap: [AppComponent]
})

export class AppModule { }
