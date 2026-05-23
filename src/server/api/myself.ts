import { createApp, createRouter, getCookie, readBody } from 'h3'
import { logger } from '~~/logger';
import { fetchPNID, fetchFriendInfo } from '~~/util';
import type { Myself } from '~~/types/myself';
import { getUserData } from '~~/database';

export default defineEventHandler(async (event) => {
	logger.debug('Getting myself');
	const authToken = getCookie(event, 'access_token');

	if (!authToken) return null;
	const userData = await fetchPNID(authToken).catch((e) => {
		logger.error(e);
	});

	if (!userData) return null;
	const friendInfo = await fetchFriendInfo(userData.pid).catch((e) => {
		logger.error(e);
	})

	const settings = await getUserData(userData.pid);

	if (!friendInfo || !settings) return null;

	const myself: Myself = {
		tagTheme: settings?.splash_tag_classes,
		userInfo: friendInfo.user
	}

	return myself;
});


