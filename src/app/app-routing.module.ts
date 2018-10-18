import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ApplicationsComponent } from './layout/pages/applications/applications.component';
import { AuthGuardService } from './core/index';
import { UserComponent } from './layout/pages/user/user.component';
import { SettingsComponent } from './layout/pages/user/settings/settings.component';
import { RolesComponent } from './layout/pages/user/roles/roles.component';
import { UsersComponent } from './layout/pages/user/users/users.component';
import { SamplePrepComponent } from './layout/pages/sample-prep/sample-prep.component';
import { FormComponent } from './layout/pages/form/form.component';
import { LoginComponent } from './layout/pages/user/login/login.component';
import { CreateSamplePrepComponent } from './layout/pages/sample-prep/create/create.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'login', component: LoginComponent },
			{ path: '', canActivate: [AuthGuardService], children: [
					{ path: '', component: ApplicationsComponent, pathMatch: 'full' },

					{path: 'form-gc', children: [
							{ path: '', component: FormComponent, pathMatch: 'full' },
							{ path: ':id', component: FormComponent },
						]
					},
					{ path: 'form-lc', children: [
							{ path: '', component: FormComponent, pathMatch: 'full' },
							{ path: ':id', component: FormComponent },
						]
					},
					{ path: 'user', children: [
							{ path: '', component: UserComponent, pathMatch: 'full' },
							{ path: 'settings', component: SettingsComponent },
							{ path: 'roles', component: RolesComponent },
							{ path: 'users', component: UsersComponent }
						]
					},
					{ path: 'sample-preps', children: [
							{ path: '', component: SamplePrepComponent, pathMatch: 'full' },
							{path: 'create', children: [
									{ path: '', component: CreateSamplePrepComponent, pathMatch: 'full' },
									{path: ':id', children: [
											{ path: '', component: CreateSamplePrepComponent, pathMatch: 'full' },
											{ path: 'form-lc', component: CreateSamplePrepComponent },
											{ path: 'form-gc', component: CreateSamplePrepComponent },
										]
									},
								]
							}
						]
					}
				]
			}
		])
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
