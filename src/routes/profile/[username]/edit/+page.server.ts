import { getProfile } from '$lib/core/data/api';
import getClient from '$lib/core/data/apiClient';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad = async (event) => {
	const { locals, params } = event;

	const { session } = await getSupabase(event);

	if (!session) {
		throw redirect(303, '/login');
	}

	const client = getClient(event);

	if (!(await client.userExists(params.username))) {
		throw error(404, 'This user does not seem to exist.');
	}

	if (locals.userinfo?.username != params.username) {
		throw error(403, 'You do not have access to this page');
	}

	var profile = await client.getProfile(params.username);

	return {
		slug: params.username,
		profile: profile
	};
};

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	default: async (event) => {
		const { request, params } = event;

		const formData = await request.formData();
		const description = formData.get('description');

		const { session, supabaseClient } = await getSupabase(event)

		await getClient(event).updateProfileDescription(
			params.username,
			(description as string).trim()
		);

		throw redirect(302, `/profile/${params.username}`);
	}
};
