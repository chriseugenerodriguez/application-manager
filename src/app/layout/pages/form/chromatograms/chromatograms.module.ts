import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { ChromatogramsComponent } from './chromatograms.component';
import { AccordionModule } from 'ngx-bootstrap';

import { UploadModule } from '@progress/kendo-angular-upload';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		AccordionModule.forRoot(),
		UploadModule,
		FormsModule,
		ReactiveFormsModule

	],
	declarations: [
		ChromatogramsComponent

	],
	exports: [
		ChromatogramsComponent
	]
})
export class ChromatogramsModule { }
