import '$lib/core/data/supabase';
import supabase from '$lib/core/data/supabase';
import { clearSession, COOKIE_NAME } from '$lib/core/helpers/sessionHelper';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get(COOKIE_NAME);

	if (!session) {
		return await resolve(event);
	}

	const { data, error } = await supabase.auth.getUser(session);

	if (error) {
		// if get user gets error, clear session, might be token expiration or deleted user
		// TODO: refresh token?
		console.log('user auth failed, deleting session');

		clearSession(event);

		return await resolve(event);
	}

	if (data?.user) {
		event.locals.user = data.user;

		const { data: profileData, error } = await supabase
			.from('profiles')
			.select('username, description')
			.eq('id', data.user.id)
			.single();

		event.locals.userinfo = {
			username: profileData?.username
		};
	} else {
		// this probably shouldnt happen, but to be safe, clear session
		clearSession(event);
		return await resolve(event);
	}

	return await resolve(event);
};
