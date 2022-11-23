import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import { invalid, redirect } from '@sveltejs/kit';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	default: async ({ request }: any) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const password_confirm = formData.get('password_confirm');

		if (password != password_confirm) {
			console.log('nahhh');
			return invalid(400, { message: 'Passwords do not match' });
		}

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password
		});

		if (data.user) {
			throw redirect(303, '/');
		} else {
			return invalid(400, { message: error?.message });
		}
	}
};