import { TestBed, async, inject, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { APIService } from '../api'


describe('Users:', () => {

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpModule
			],
			providers: [
				{provide: HttpClient, deps: [MockBackend]},
				APIService
		]
		});

		TestBed.compileComponents();
	}));

	describe('User -', () => {
		it('Return back 200 response', async(inject([APIService], (service: APIService) => {
			service.get('users').subscribe((r) => {
				expect(r.status).toBe('200');
			});
		})));

	});

});
