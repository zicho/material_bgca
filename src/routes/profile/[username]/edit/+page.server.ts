import { getProfile, updateProfileDescription } from "$lib/core/api";
import supabase from "$lib/core/supabase";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	if(locals.profile?.username != params.username) {
		throw error(403, "You do not have access to this page");
	}

	var profile = await getProfile(params.username);

	return {
        slug: params.username,
		profileInfo: profile,
    }
};

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	default: async ({ request, params, session }: any) => {
		const formData = await request.formData();
		const description = formData.get('description');


		await updateProfileDescription(params.username, description.trim());

		throw redirect(302, `/profile/${params.username}`)
	}
};
