type BossFile = {
	Filename: string;
	DataId: string;
	Type: string;
	Url: string;
	Size: string;
	Notify: {
		New: string;
		LED: string
	}
}

type TaskSheet = {
  TaskSheet: {
	TitleId: string;
	TaskId: string;
	ServiceStatus: 'open' | 'closed';
	Files: {
		File: [BossFile];
	}
  }
};

export {
	BossFile,
	TaskSheet
}