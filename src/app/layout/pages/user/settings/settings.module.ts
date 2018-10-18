import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { SettingsComponent } from './settings.component';

// KENDO UI
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		DropDownsModule,
		FormsModule,
		ReactiveFormsModule,
		InputsModule
	],
	declarations: [
		SettingsComponent
	],
	exports: [
		SettingsComponent
	]
})
export class SettingsModule { }
