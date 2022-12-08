import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import supabase from '$lib/core/data/supabase';
import { ApiClient } from '$lib/core/data/api';

export const load: LayoutServerLoad = async (event) => {
	const session = await getServerSession(event);
	const { data } = await supabase.auth.getUser(session?.access_token);

	const { data: profileData } = await supabase
		.from('profiles')
		.select('username')
		.eq('id', data.user?.id)
		.single();

	const unreadMessageCount = await new ApiClient(event).getUnreadMessageCount(profileData?.username as string);

	//TODO: use locals?
	// event.locals.user = data.user;
	event.locals.userinfo = {
		username: profileData?.username
	};
	
	return {
		session: session,
		user: data.user,
		userinfo: {
			username: profileData?.username
		},
		messageCount: unreadMessageCount
	};
};
