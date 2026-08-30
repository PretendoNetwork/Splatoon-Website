import type { Stage } from '~~/shared/types/settings';

export type NewsItem = {
	Command: 'SpeakRawText';
	Emotion: 'cHappy' | 'cNormalTalk' | 'cSurprised' | 'cGreeting' | 'cFeed' | 'cAngry';
	Speaker: 'cIdolLeft' | 'cIdolRight';
	Text: string;
	WaitButton: boolean;
};

export type News = {
	EUde: [NewsItem];
	EUen: [NewsItem];
	EUes: [NewsItem];
	EUfr: [NewsItem];
	EUit: [NewsItem];
	JPja: [NewsItem];
	USen: [NewsItem];
	USes: [NewsItem];
	USfr: [NewsItem];
	NewsType: string;
};

export type TeamNameTranslations = {
	EUde: string;
	EUen: string;
	EUes: string;
	EUfr: string;
	EUit: string;
	JPja: string;
	USen: string;
	USes: string;
	USfr: string;
};

export type TitleTranslations = {
	'de-EU': string;
	'en-EU': string;
	'es-EU': string;
	'fr-EU': string;
	'it-EU': string;
	'ja-JP': string;
	'en-US': string;
	'es-US': string;
	'fr-US': string;
	'es-ES': string;
};

export type Team = {
	Color: string;
	Name: TeamNameTranslations | undefined;
	ShortName: TeamNameTranslations | undefined;
};

export type AnnouncementIntervals = {
	Announce: string;
	End: string;
	Result: string;
	Start: string;
};

export type Festival = {
	BattleResultRate: number;
	FestivalId: number;
	LowPopulationNotJP: boolean;
	News: [News];
	Rule: 'cPnt';
	SeparateMatchingJP: boolean;
	Stages: [Stage];
	Teams: [Team];
	Time: AnnouncementIntervals;
	Version: number;
	FetchedAt: number;
	Title: TitleTranslations;
	isAnnounced: boolean;
	isEnded: boolean;
	isStarted: boolean;
	resultsPosted: boolean;
	isActive: boolean;
	translationID: string;
};
