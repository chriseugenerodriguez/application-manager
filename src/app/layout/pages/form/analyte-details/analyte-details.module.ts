import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { AnalyteDetailsComponent } from './analyte-details.component';
import { AccordionModule } from 'ngx-bootstrap';

// KENDO UI
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { UploadModule } from '@progress/kendo-angular-upload';
import { HttpClientModule } from '@angular/common/http';

import { PdfViewerModule } from 'ng2-pdf-viewer';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		AccordionModule.forRoot(),
		DropDownsModule,
		UploadModule,
		FormsModule,
		ReactiveFormsModule,
		PdfViewerModule,
		HttpClientModule
	],
	declarations: [
		AnalyteDetailsComponent

	],
	exports: [
		AnalyteDetailsComponent
	]
})
export class AnalyteDetailsModule { }
