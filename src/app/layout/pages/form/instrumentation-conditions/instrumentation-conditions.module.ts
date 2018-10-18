import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Jsonp, JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { InstrumentationConditionsComponent } from './instrumentation-conditions.component';
import { AccordionModule } from 'ngx-bootstrap';

// KENDO UI
import { DropDownsModule, AutoCompleteModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		AccordionModule.forRoot(),
		DropDownsModule,
		AutoCompleteModule,
		FormsModule,
		ReactiveFormsModule,
		InputsModule,
	],
	declarations: [
		InstrumentationConditionsComponent
	],
	exports: [
		InstrumentationConditionsComponent
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class InstrumentationConditionsModule { }
