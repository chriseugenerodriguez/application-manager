export interface IApplicationForm {
	ApplicationTitle: string;
	Overview: IOverview[];
	ColumnDetails: IColumnDetails[];
	InstrumentationConditions: IInstrumentationConditions[];
	AnalyteDetails: IAnalyteDetails[];
	SamplePreparationMethodology: ISamplePreparationMethodology[];
	Chromatograms: IChromatograms[];
	DocumentTerms: IDocumentTerms[];
	CodingRelatedTerms: ICodingRelatedTerms[];
};

export interface IOverview {
	ApplicationReason: string;
	CustomerThirdPartyDetails: string;
	SeparationMode: object;
};

export interface IColumnDetails {
	PHECompetitorColumn: object;
	PHEPartNumber: object;
	Description1: string;
	Description2: string;
	CommercialDescription: string;
	MfgCode: object;
	BrandCode: object;
	Length: object;
	InternalDiameter: object;
	FilmThickness: object;
	ParticalSize: object;
	LiquidPhase: object;
	PoreSize: object;
	SerialNumber: number;
	BatchNumber: number;
	ColumnEfficiency: string;
	InletBaseSeal: object;
	PeakCapacity: string;
	InletLiner: object;
	GuardCartridge: object;
	GuardColumn: object;
	GuardHolder: object;
	SyringeFilter: object;
};

export interface IInstrumentationConditions {
	InjVolume: number;
	InjUnit: object;
	InjectorTemp: number;
	ColumnTemp: number;
	DetectorTemp: number;
	GCSystem: object;
	DetectorType: object;
	DetectorInstrumentation: object;
	DetectorDetail1: number;
	Unit1: object;
	DetectorDetail2: number;
	Unit2: object;
	FlowRate: object;
	FlowRateTechnique: object;
	InjectionMode: object;
	CarrierGas: object;
	SplitRatio: object;
	SplitnessHoldTime: object;
	InstrumentationGrid: object;
};

export interface IAnalyteDetails {
	Matrix: object;
	SamplePreperation: object;
	UploadAnalyteDetails: object;
	MatrixNotes: string;
	AnalyteDiluentNotes: string;
	AnalyteDetailsGrid: object;
};

export interface ISamplePreparationMethodology {
	SearchExistingSamplePreps: object;
	SamplePrepTitle: string;
	PreTreatmentNote: string;
	SamplePrepNotes: string;
	SamplePrepTechnique: object;
	PHECompetitorColumn: object;
	PHEPartNumber: object;
	Description1: string;
	Description2: string;
	CommercialDescription: string;
	MfgCode: object;
	BrandCode: object;
	FormatType: object;
	FormatSubType: object;
	FormatSize: object;
	UOM: object;
	Mass: object;
	SupportType: object;
	PhaseID: object;
	SorbentLot: object;
	ProductionLot: string;
	SamplePrepGrid: object;
};

export interface IChromatograms {
	SVGChromatogram: object;
	IMGChromatogram: object;
};

export interface IDocumentTerms {
	UploadDocument: object;
	OfficalAgency: object;
	OfficialMethodNumber: string;
};

export interface ICodingRelatedTerms {
	RelatedTerms: string;
	CreativeJobNumbers: string;
	Industry: object;
	Compound: object;
};
