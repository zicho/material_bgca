import { ApiClient } from "$lib/core/data/api";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad = async (event) => {
	const { session } = await getSupabase(event);
	if (!session) {
		throw redirect(302, '/login');
	}

	const { params, locals } = event;

	if(locals.userinfo?.username != params.username) {
		throw error(403, "You do not have access to this page");
	}

	var profile = await new ApiClient(event).getProfile(params.username);

	return {
        slug: params.username,
		profile: profile,
    }
};

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	default: async (event) => {
		const { request, params } = event;
		const formData = await request.formData();
		const description = formData.get('description');

		await new ApiClient(event).updateProfileDescription(params.username, (description as string).trim());

		throw redirect(302, `/profile/${params.username}`)
	}
};
