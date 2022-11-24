import { getUnreadMessageCount } from '$lib/core/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// todo: load unread messages

    let unreadMessageCount = await getUnreadMessageCount(locals.userinfo?.username as string)

	return {
		user: locals.user,
		userinfo: locals.userinfo,
		messageCount: unreadMessageCount
	};
};
