export type BossFile = {
	Filename: string;
	DataId: string;
	Type: string;
	Url: string;
	Size: string;
	Notify: {
		New: string;
		LED: string;
	};
};

export type TaskSheet = {
	TaskSheet: {
		TitleId: string;
		TaskId: string;
		ServiceStatus: 'open' | 'closed';
		Files: {
			File: [BossFile];
		};
	};
};
