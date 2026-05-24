export type Stage = {
	MapID: number;
};

export type RankedTypes = 'cVar' | 'cVlf' | 'cVgl';

export type Phase = {
	GachiRule: RankedTypes;
	GachiStages: [Stage];
	RegularRule: 'cPnt';
	RegularStages: [Stage];
	Time: number;
	Date: string;
};

export type Settings = {
	AddFirstMatchingTime: number;
	AddMatchingTime: number;
	AfterFesBonusStart: string;
	BottleneckThreasholdFrame: number;
	ByamlInfo: {
		BaseByamlStartTime: string;
		GenerationTime: string;
		Generator: string;
		PhaseLength: number;
		RandomSeed: string;
		ScheduleLength: number;
	};
	DateTime: string;
	DisconnectByMemoryHash: boolean;
	MapFirstAppear: [
		{
			Date: string;
			MapID: number;
		}
	];
	Phases: [Phase];
	RuleFirstAppear: [
		{
			Date: string;
			GachiRule: RankedTypes;
		}
	];
	TimeoutAfterJoin: number;
	Version: number;
	WaitMatchingTime: number;
	WeaponUnlock: [
		{
			Date: string;
			WeaponSetID: number;
		}
	];
	WebPost: boolean;
};
