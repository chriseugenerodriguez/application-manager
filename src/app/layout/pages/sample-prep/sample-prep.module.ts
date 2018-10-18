import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { SamplePrepComponent } from './sample-prep.component';
import { CreateSamplePrepComponent } from './create/create.component';

// KENDO UI
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';

// BOOTSTRAP
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		BsDropdownModule.forRoot(),
		FormsModule,
		ReactiveFormsModule,
		DropDownsModule,
		GridModule,
	],
	declarations: [
		SamplePrepComponent,
		CreateSamplePrepComponent
	],
	exports: [
		SamplePrepComponent,
		CreateSamplePrepComponent,
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SamplePrepModule { }
