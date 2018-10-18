import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';

// RELATED
import { CodingRelatedTermsComponent } from './coding-related-terms.component';
import { AccordionModule } from 'ngx-bootstrap';

// KENDO UI
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		AccordionModule.forRoot(),
		DropDownsModule,
		FormsModule,
		ReactiveFormsModule

	],
	declarations: [
		CodingRelatedTermsComponent

	],
	exports: [
		CodingRelatedTermsComponent
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CodingRelatedTermsModule { }
