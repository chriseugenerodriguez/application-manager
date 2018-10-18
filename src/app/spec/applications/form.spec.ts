import { TestBed, async, inject, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { APIService } from '../api'


describe('Applications:', () => {

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

	describe('Form -', () => {

		describe('Overview:', () => {
			it('Separation Mode', async(inject([APIService], (service: APIService) => {
				service.get('lookup/SeparationMode').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));
		});

		describe('Column Details:', () => {
			it('PHE or Competitor', async(inject([APIService], (service: APIService) => {
				service.get('lookup/PHECompetitorKey').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Inlet Base Seal', async(inject([APIService], (service: APIService) => {
				service.get('lookup/InletBaseSeal').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Inlet Liner', async(inject([APIService], (service: APIService) => {
				service.get('lookup/InletLiner').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Guard Column', async(inject([APIService], (service: APIService) => {
				service.get('lookup/GuardColumn').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Syringe Filter', async(inject([APIService], (service: APIService) => {
				service.get('lookup/SyringeFilter').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('PHE Part Number', async(inject([APIService], (service: APIService) => {
				service.get('lookup/PHEPartNumberKey').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Guard Cartridge', async(inject([APIService], (service: APIService) => {
				service.get('lookup/GuardCartridge').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Guard Holder', async(inject([APIService], (service: APIService) => {
				service.get('lookup/GuardHolder').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Mfg Code', async(inject([APIService], (service: APIService) => {
				service.get('lookup/mfgCodeKey').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Brand Code', async(inject([APIService], (service: APIService) => {
				service.get('lookup/brandCodeKey').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

		});

		describe('Instrumentation and Conditions:', () => {
			it('Inj Unit', async(inject([APIService], (service: APIService) => {
				service.get('lookup/InjUnit').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('LC System', async(inject([APIService], (service: APIService) => {
				service.get('lookup/LCSystem').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Detector Type', async(inject([APIService], (service: APIService) => {
				service.get('lookup/DetectorType').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Detector Instrumentation', async(inject([APIService], (service: APIService) => {
				service.get('lookup/DetectorInstrumentation').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Ionization Type', async(inject([APIService], (service: APIService) => {
				service.get('lookup/IonizationType').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Flow Rate Unit', async(inject([APIService], (service: APIService) => {
				service.get('lookup/FlowRateUnit').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('GC System', async(inject([APIService], (service: APIService) => {
				service.get('lookup/GCSystem').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Unit 1', async(inject([APIService], (service: APIService) => {
				service.get('lookup/Unit1').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Unit 2', async(inject([APIService], (service: APIService) => {
				service.get('lookup/Unit2').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Flow Rate Technique', async(inject([APIService], (service: APIService) => {
				service.get('lookup/FlowRateTechnique').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Injection Mode', async(inject([APIService], (service: APIService) => {
				service.get('lookup/InjectionMode').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Carrier Gas', async(inject([APIService], (service: APIService) => {
				service.get('lookup/CarrierGas').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Flow Type', async(inject([APIService], (service: APIService) => {
				service.get('lookup/FlowType').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));
		});

		describe('Analyte Details:', () => {
			it('Matrix', async(inject([APIService], (service: APIService) => {
				service.get('lookup/Matrix').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Sample Preparation', async(inject([APIService], (service: APIService) => {
				service.get('lookup/SamplePreparation').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));
		});

		describe('Sample Prep Method:', () => {
			it('Search Existing Sample Prep', async(inject([APIService], (service: APIService) => {
				service.get('lookup/SearchExistingSamplePrep').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));
		});

		describe('Documents and Official Method:', () => {
			it('Offical Agency', async(inject([APIService], (service: APIService) => {
				service.get('lookup/OfficalAgency').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Official Method Number', async(inject([APIService], (service: APIService) => {
				service.get('lookup/OfficialMethodNumber').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));
		});

		describe('Coding and Related Terms:', () => {
			it('Industry', async(inject([APIService], (service: APIService) => {
				service.get('lookup/Industry').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));

			it('Compound', async(inject([APIService], (service: APIService) => {
				service.get('lookup/Compound').subscribe((r) => {
					expect(r).toBeDefined();
				});
			})));
		});

	});
});
