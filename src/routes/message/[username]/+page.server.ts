import { getProfile, sendMessage, userExists } from "$lib/core/api";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
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
