import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { invalid, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { session } = await getSupabase(event);

	if (session) {
		throw redirect(302, '/');
	}
};

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	default: async (event) => {
		const { request, cookies } = event;

		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { supabaseClient } = await getSupabase(event);

		const { data, error } = await supabaseClient.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (data.session) {

			throw redirect(302, '/');
		} else {
			return invalid(400, { message: error?.message, email: email });
		}
	}
};
