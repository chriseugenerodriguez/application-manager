import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { ApplicationsComponent } from './applications.component';

// KENDO UI
import { GridModule } from '@progress/kendo-angular-grid';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		GridModule,
		BsDropdownModule.forRoot(),
		RouterModule
	],
	declarations: [
		ApplicationsComponent,

	],
	exports: [
		ApplicationsComponent,
		GridModule
	]
})
export class ApplicationsModule { }
