import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { SamplePreparationMethodologyComponent } from './sample-preparation-methodology.component';
import { AccordionModule } from 'ngx-bootstrap';

// KENDO UI
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		AccordionModule.forRoot(),
		DropDownsModule,
		DialogModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		SamplePreparationMethodologyComponent
	],
	exports: [
		SamplePreparationMethodologyComponent
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SamplePreparationMethodologyModule { }
