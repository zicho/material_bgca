
import { error, redirect } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageServerLoad } from './$types';
import { ApiClient } from '$lib/core/data/api';

export const load: PageServerLoad = async (event) => {
	const { session } = await getSupabase(event);
	const { params, locals } = event;

	if (!session) {
		throw redirect(302, '/login');
	}

	const client = new ApiClient(event)

	if (!(await client.userExists(params.username))) {
		throw error(404, 'This user does not seem to exist.');
	}

	var profile = await client.getProfile(params.username);

	return {
		slug: params.username,
		username: 'test',
		profile: profile,
		isYourPage: locals.userinfo?.username == params.username
	};
};
