import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusComponent } from '../status/status.component';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		StatusComponent
	],
	exports: [
		StatusComponent
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class StatusModule { }
