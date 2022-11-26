import { getProfile, userExists } from "$lib/core/data/api";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	if(!await userExists(params.username)) {
		throw error(404, "This user does not seem to exist.")
	}

	var profile = await getProfile(params.username);
	
	return {
        slug: params.username,
		username: locals.userinfo?.username,
		profile: profile,
		isYourPage: locals.userinfo?.username == params.username
    }
};