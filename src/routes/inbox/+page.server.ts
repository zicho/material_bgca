import { getMessages } from "$lib/core/data/api";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

    let messages = await getMessages(locals.userinfo?.username)

    return {
        messages
    }
};