import supabase from './lib/core/supabase';
import type { Handle } from '@sveltejs/kit';
import { invalid } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	if (!session) {
		return await resolve(event);
	}

	const { data, error } = await supabase.auth.getUser(session);

	// if(error) {
	//     return invalid(400, { message: error?.message });
	// }

	if (data?.user) {
		event.locals.user = data.user;
	}

	return await resolve(event);
};
