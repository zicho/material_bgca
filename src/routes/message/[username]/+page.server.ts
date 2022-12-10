import { sendMessage, userExists } from '$lib/core/data/api';
import { error, redirect } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageServerLoad } from './$types';
import getClient from '$lib/core/data/apiClient';
import { notifySuccess } from '$lib/core/notify';

export const load: PageServerLoad = async (event) => {
	const { session } = await getSupabase(event);
	const { params } = event;

	if (!session) {
		throw redirect(302, '/login');
	}

	if (!(await userExists(params.username))) {
		throw error(404, 'This user does not seem to exist.');
	}

	if (event.locals.userinfo?.username == params.username) {
		throw redirect(302, `/profile/${event.locals.userinfo?.username}`);
	}

	return {
		slug: params.username
	};
};

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	default: async (event) => {
		const { request, params, locals } = event;
		const formData = await request.formData();
		const content = formData.get('content');

		await getClient(event).sendMessage(locals.userinfo?.username as string, params.username, content as string);
		throw redirect(302, `/profile/${params.username}`);
	}
};
