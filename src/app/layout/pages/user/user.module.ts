import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// RELATED
import { UserComponent } from './user.component';

// CHILDREN
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { RolesModule } from './roles/roles.module';

// IMPORT MODULES, DECLARE COMPONENTS
@NgModule({
	imports: [
		CommonModule,
		RouterModule,

		// CHILDREN
		UsersModule,
		SettingsModule,
		RolesModule
	],
	declarations: [
		UserComponent
	],
	exports: [
		UserComponent,

		// CHILDREN
		UsersModule,
		SettingsModule,
		RolesModule
	]
})
export class UserModule { }
