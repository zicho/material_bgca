import {  userExists } from '$lib/core/data/api';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import getApiClient, { ApiClient } from '$lib/core/data/apiClient';

export const load: PageServerLoad = async (event) => {
	const { session } = await getSupabase(event);

	if (!session) {
		throw redirect(302, '/login');
	}

	const { locals, params } = event;

	let client = getApiClient(event)

	if (!(await client.userExists(params.username))) {
		throw error(404, 'This user does not seem to exist.');
	}

	var profile = await client.getProfile(params.username);

	return {
		slug: params.username,
		username: locals.userinfo?.username,
		profile: profile,
		isYourPage: locals.userinfo?.username == params.username
	};
};
