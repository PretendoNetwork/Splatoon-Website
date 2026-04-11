interface Match {
  id: number;
	started_time: Date;
  participants: [number];
	owner_pid: number;
	game_mode: number;
	flags: number;
}

export {
	Match
}
