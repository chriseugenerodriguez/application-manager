import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StatusModule } from './status/status.module';

// RELATED
import { FormComponent } from './form.component';
import { AccordionModule } from 'ngx-bootstrap';

// CHILDREN
import { AnalyteDetailsModule } from './analyte-details/analyte-details.module';
import { ChromatogramsModule } from './chromatograms/chromatograms.module';
import { ColumnDetailsModule } from './column-details/column-details.module';
import { DocumentTermsModule } from './document-terms/document-terms.module';
import { InstrumentationConditionsModule } from './instrumentation-conditions/instrumentation-conditions.module';
import { OverviewModule } from './overview/overview.module';
import { SamplePreparationMethodologyModule } from './sample-preparation-methodology/sample-preparation-methodology.module';
import { CodingRelatedTermsModule } from './coding-related-terms/coding-related-terms.module';

// KENDO UI
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

// ALERT
import { AlertModule } from 'ngx-bootstrap';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AccordionModule.forRoot(),
		AlertModule.forRoot(),
		DropDownsModule,
		StatusModule,

		// CHILDREN
		OverviewModule,
		ColumnDetailsModule,
		InstrumentationConditionsModule,
		AnalyteDetailsModule,
		SamplePreparationMethodologyModule,
		DocumentTermsModule,
		CodingRelatedTermsModule,
		ChromatogramsModule
	],
	declarations: [
		FormComponent,
	],
	exports: [
		FormComponent
	]
})
export class FormModule { }
