import { sendMessage, userExists } from "$lib/core/data/api";
import { error, redirect } from "@sveltejs/kit";
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {

	const { session } = await getSupabase(event);
	const { params } = event;

	if (!session) {
		throw redirect(302, '/login');
	}

	if(!await userExists(params.username)) {
		throw error(404, "This user does not seem to exist.")
	}

	if(locals.userinfo?.username == params.username) {
		throw redirect(302, `/profile/${locals.userinfo?.username}`);
	}

	return {
        slug: params.username
    }
};

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	default: async ({ request, params, locals }: any) => {
		const formData = await request.formData();
		const content = formData.get('content');

		await sendMessage(locals.userinfo.username, params.username, content);
		throw redirect(302, `/profile/${params.username}`)
	}
};
