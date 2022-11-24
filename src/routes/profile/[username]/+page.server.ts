import { getProfile } from "$lib/core/api";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	var profile = await getProfile(params.username);

	return {
        slug: params.username,
		username: locals.userinfo?.username,
		profile: profile,
		isYourPage: locals.userinfo?.username == params.username
    }
};