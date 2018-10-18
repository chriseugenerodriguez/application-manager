import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// RELATED
import { UsersComponent } from './users.component';

// KENDO UI
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		DialogModule,
		DropDownsModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		UsersComponent
	],
	exports: [
		UsersComponent
	]
})

export class UsersModule { }
