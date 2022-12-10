import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import supabase from '$lib/core/data/supabase';
import getClient from '$lib/core/data/apiClient';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	const session = await getServerSession(event);

	const data = await getClient(event).getUser(session?.access_token);
	const username = data?.user_metadata.username;

	const unreadMessageCount = await getClient(event).getUnreadMessageCount(username);

	return {
		session: session,
		user: data,
		userinfo: {
			username: username
		},
		messageCount: unreadMessageCount
	};
};
