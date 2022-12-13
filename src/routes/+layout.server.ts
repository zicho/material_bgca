import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import getClient from '$lib/core/data/apiClient';

export const load: LayoutServerLoad = async (event) => {
	const session = await getServerSession(event);

	const data = await getClient(event).getUser(session?.access_token);
	const username = data?.user_metadata.username;

	const unreadMessageCount = await getClient(event).getUnreadMessageCount();

	return {
		session: session,
		user: data,
		userinfo: {
			username: username
		},
		messageCount: unreadMessageCount
	};
};
