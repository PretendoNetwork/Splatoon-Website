import { getCookie, readBody } from 'h3';
import type { IUser } from '~~/shared/types/mongoose/user';

export default defineEventHandler(async (event) => {
	logger.debug('Updating user data');
	const authToken = getCookie(event, 'access_token');
	const { class_list } = await readBody(event);

	if (!authToken || !class_list) {
		logger.warn('Missing auth token or class list');
		return null;
	}
	const userData = await fetchPNID(authToken).catch((e) => {
		logger.error(e);
	});

	if (!userData) {
		return null;
	}

	const settings = await getUserData(userData.pid).catch((e) => {
		logger.error(e);
	});

	if (!settings) {
		const document: IUser = {
			pid: userData.pid,
			splash_tag_classes: class_list
		};
		await User.create(document);
	} else {
		settings.splash_tag_classes = class_list;
		await settings.save();
	}
});
