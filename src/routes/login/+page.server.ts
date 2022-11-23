import { invalid, redirect } from '@sveltejs/kit';
import supabase from '../../lib/core/supabase';

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	default: async ({ request, cookies }: any) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (data.session) {
			cookies.set('session', data.session.access_token, {
				path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV == 'production',
        maxAge: 60 * 60 * 24 * 30
			});
			throw redirect(302, '/');
		} else {
			return invalid(400, { message: error?.message });
		}
	}
};
