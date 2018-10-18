import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { DocumentTermsComponent } from './document-terms.component';
import { AccordionModule } from 'ngx-bootstrap';

// KENDO UI
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { UploadModule } from '@progress/kendo-angular-upload';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AccordionModule.forRoot(),
		DropDownsModule,
		UploadModule,
		FormsModule
	],
	declarations: [
		DocumentTermsComponent

	],
	exports: [
		DocumentTermsComponent
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DocumentTermsModule { }
