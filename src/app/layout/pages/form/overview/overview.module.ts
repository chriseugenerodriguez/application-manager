import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// RELATED
import { OverviewComponent } from './overview.component';

// BOOTSTRAP
import { AccordionModule } from 'ngx-bootstrap';

// KENDO UI
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AccordionModule.forRoot(),
		DropDownsModule
	],
	declarations: [
		OverviewComponent

	],
	exports: [
		OverviewComponent
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class OverviewModule { }
