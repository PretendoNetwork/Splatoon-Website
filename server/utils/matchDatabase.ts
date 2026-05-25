import postgres from 'postgres';

const config = useRuntimeConfig();
const { postgresURI } = config;

let sql: postgres.Sql | undefined = undefined;

export async function connectDB(): Promise<void> {
	logger.info('Connecting to database...');
	try {
		sql = postgres(postgresURI);
		logger.success('Database connected!');
	} catch (e) {
		logger.fatal(e, 'Failed to connect to DB!');
		process.exit(-1);
	}
}

export async function fetchMatches(): Promise<Match[]> {
	if (!sql) {
		await connectDB();
	}
	if (!sql) {
		return [];
	}
	try {
		const result = await sql<Match[]>`
			SELECT g.id, g.started_time, g.participants,g.owner_pid,s.game_mode,g.flags,s.matchmake_param
			FROM matchmaking.gatherings g
			JOIN matchmaking.matchmake_sessions s ON (g.id = s.id)
			WHERE array_length(g.participants, 1) > 0 and g.registered=true AND s.open_participation = true
			ORDER BY started_time ASC LIMIT 25`;

		return result;
	} catch (e) {
		logger.error(e);
		return [];
	}
}
