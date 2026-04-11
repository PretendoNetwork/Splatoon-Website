import postgres from 'postgres';
import logger from '~~/logger';
import type { Match } from '~~/types/database';
const config = useRuntimeConfig();

const { postgresURI } = config;

let sql: postgres.Sql | undefined = undefined;

async function connectDB() {
	try {
		sql = postgres(postgresURI);
		logger.success('Database connected!');
	} catch(e) {
		logger.fatal('Failed to connect to DB!', e);
		process.exit(-1);
	}
}

async function fetchMatches(): Promise<Match[]> {
	if (!sql) return [];

	const result = await sql<Match[]>`
			SELECT g.id, g.started_time, g.participants,g.owner_pid,s.game_mode,g.flags
			FROM matchmaking.gatherings g
			JOIN matchmaking.matchmake_sessions s ON (g.id = s.id)
			WHERE array_length(g.participants, 1) > 4 AND s.open_participation = true
			LIMIT 25`;
	return result;
}

connectDB();

export {
	fetchMatches
}
