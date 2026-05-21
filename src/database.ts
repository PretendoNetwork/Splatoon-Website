import mongoose from 'mongoose';
import { logger } from '~~/logger';
import { User } from '~~/models/user';
import type { HydratedUserDocument } from '~~/types/mongoose/user';

const config = useRuntimeConfig();
const { mongoURI } = config;

let connection: mongoose.Connection;
mongoose.set('strictQuery', true);

export async function connect(): Promise<void> {
	connection = mongoose.connection;
	connection.on('connected', () => {
		logger.info('MongoDB connected');
	});
	connection.on('error', err => logger.error(err, 'Database connection error'));
	connection.on('close', () => {
		connection.removeAllListeners();
	});

	await mongoose.connect(mongoURI);
}

function verifyConnected(): void {
	if (!connection) {
		connect();
	}
}

export async function getUserData(pid: number): Promise<HydratedUserDocument | null> {
	verifyConnected();

	return User.findOne({ pid });
}

export async function getUsersData(pids: number[]): Promise<HydratedUserDocument[]> {
	verifyConnected();

	return User.find({ pid: pids });
}
