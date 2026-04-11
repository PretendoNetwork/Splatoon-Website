interface Match {
  id: string;
	started_time: Date;
  participants: [number];
	owner_pid: number;
	game_mode: number;
	flags: number;
}

export {
	Match
}
