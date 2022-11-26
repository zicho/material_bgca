import { getMessages } from "$lib/core/data/api";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params, request, url }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

    let pageNo = url.searchParams.get('page') as unknown as number;
    let messages = await getMessages(locals.userinfo?.username)

    if(isNaN(+pageNo) || !pageNo) {
        pageNo = 0;
    }

    return {
        messages,
        pageNo: +pageNo
    }
};