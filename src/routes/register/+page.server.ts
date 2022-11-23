import { invalid, redirect } from '@sveltejs/kit';
import supabase from '../../lib/core/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	default: async ({ request, cookies }: any) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const password_confirm = formData.get('password_confirm');

		if (typeof email != 'string' || typeof password != 'string' || !email || !password) {
			return invalid(400, { message: 'Incorrect data in input fields' });
		}

		if (password != password_confirm) {
			return invalid(400, { message: 'Passwords do not match' });
		}

		const { data, error } = await supabase.auth.signUp({
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
