import { createChannel, createClient, Metadata } from 'nice-grpc';
import { AccountServiceDefinition } from '@pretendonetwork/grpc/account/v2/account_service';
import { APIDefinition } from '@pretendonetwork/grpc/api/api_service';
import type { GetPNIDsResponse } from '@pretendonetwork/grpc/account/v2/get_pnids_rpc';
import type { GetUserDataResponse } from '@pretendonetwork/grpc/api/get_user_data_rpc';
import { logger } from '~~/logger';

const config = useRuntimeConfig();

const { api_key, host, port } = config.grpc.account;

const gRPCAccountChannel = createChannel(`${host}:${port}`);
const gRPCAccountClient = createClient(AccountServiceDefinition, gRPCAccountChannel);

const gRPCApiChannel = createChannel(`${host}:${port}`);
const gRPCApiClient = createClient(APIDefinition, gRPCApiChannel);

export async function fetchPNIDs(pids: number[]) {
	try {
		let result: GetPNIDsResponse = await gRPCAccountClient.getPNIDs({
			pid: pids
		}, {
				metadata: Metadata({
					'X-API-Key': api_key
				})
		});
		return result.userData
	} catch (e) {
		logger.error(e);
		return []
	}
}

export async function fetchUserData(token: string): Promise<GetUserDataResponse> {
	return gRPCApiClient.getUserData({}, {
		metadata: Metadata({
			'X-API-Key': config.grpc.account.api_key,
			'X-Token': token
		})
	});
}
