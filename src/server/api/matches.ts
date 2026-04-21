import type { H3Event } from 'h3'
import { createChannel, createClient, Metadata } from 'nice-grpc';
import { AccountServiceDefinition } from '@pretendonetwork/grpc/account/v2/account_service'
import type { GetPNIDsResponse } from '@pretendonetwork/grpc/account/v2/get_pnids_rpc'
import { logger } from '~~/logger';
import { fetchMatches } from '~~/database';

const config = useRuntimeConfig();
const { api_key, host, port } = config.grpc.account;

const gRPCAccountChannel = createChannel(`${host}:${port}`);
const gRPCAccountClient = createClient(AccountServiceDefinition, gRPCAccountChannel);

async function fetchPNIDs(pids: number[]) {
	let result: GetPNIDsResponse = await gRPCAccountClient.getPNIDs({
		pid: pids
	}, {
			metadata: Metadata({
				'X-API-Key': api_key
			})
	});
	return result.userData
}

export default cachedEventHandler(async (event) => {
	logger.info('Fetching matches');
  const matches = await fetchMatches();
	const pids = matches.map(m => m.participants).flat(1);
	const pnids = await fetchPNIDs(pids)

	return matches.map(element => ({...element, participants : element.participants.map(pid => pnids[pid]?.username)}));
}, {
  maxAge: 60,
  getKey: (event: H3Event) => event.path
})
