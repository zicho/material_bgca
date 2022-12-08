// import { redirect } from "@sveltejs/kit";
// import type { PageServerLoad } from "./$types";

// export const load: PageServerLoad = async ({ locals }) => {
// 	if (!locals.user) {
// 		throw redirect(302, '/login');
// 	}

// 	return {
//         userinfo: locals.userinfo
//     }
// };

import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { session } = await getSupabase(event);

	if (!session) {
		throw redirect(303, '/login');
	}
	
	return { user: session.user };
};