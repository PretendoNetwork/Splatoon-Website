type Stage = {
	"MapID": number;
}

type RankedTypes = "cVar" | "cVlf" | "cVgl"

type Phase = {
	GachiRule: RankedTypes,
	GachiStages: [Stage],
	RegularRule: "cPnt",
	RegularStages: [Stage],
	Time: Number,
	Date: String
}

type Settings = {
    AddFirstMatchingTime: number,
    AddMatchingTime: number,
    AfterFesBonusStart: string,
    BottleneckThreasholdFrame: number,
    ByamlInfo: {
        BaseByamlStartTime: string,
        GenerationTime: string,
        Generator: string,
        PhaseLength: number,
        RandomSeed: string,
        ScheduleLength: number
    },
    DateTime: string,
    DisconnectByMemoryHash: boolean,
    MapFirstAppear: [
        {
            Date: string,
            MapID: number
        }
    ],
    Phases: [Phase],
    RuleFirstAppear: [
        {
            Date: string,
            GachiRule: RankedTypes
        }
    ],
    TimeoutAfterJoin: number,
    Version: number,
    WaitMatchingTime: number,
    WeaponUnlock: [
        {
            Date: string,
            WeaponSetID: number
        }
    ],
    WebPost: boolean
}

export {
	Stage,
	RankedTypes,
	Phase,
	Settings
}
