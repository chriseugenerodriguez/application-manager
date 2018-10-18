import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreateSamplePrepComponent } from './create.component';
import { AuthGuardService } from '../../../../core';

@NgModule({
	imports: [
		RouterModule.forChild([
			{path: 'sample-preps/create', component: CreateSamplePrepComponent, canActivate: [AuthGuardService]},
			{path: 'sample-preps/create/:id', component: CreateSamplePrepComponent, canActivate: [AuthGuardService]},
			{path: 'sample-preps/create/:appID/:appForm', component: CreateSamplePrepComponent, canActivate: [AuthGuardService]}
		])
	],
	exports: [RouterModule]
})
export class SamplePrepCreateRoutingModule { }

