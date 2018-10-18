import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';

// RELATED
import { RolesComponent } from './roles.component';

// KENDO UI
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		DropDownsModule,
		DialogModule,
		FormsModule,
		ReactiveFormsModule,
		InputsModule
	],
	declarations: [
		RolesComponent
	],
	exports: [
		RolesComponent
	]
})
export class RolesModule { }
