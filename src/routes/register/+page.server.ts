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
		const email = formData.get('email').trim();
		const username = formData.get('username').trim();
		const password = formData.get('password').trim();
		const password_confirm = formData.get('password_confirm').trim();

		if (
			typeof email != 'string' ||
			typeof username != 'string' ||
			typeof password != 'string' ||
			!email ||
			!username ||
			!password
		) {
			return invalid(400, { message: 'Incorrect data in input fields' });
		}

		if (password != password_confirm) {
			return invalid(400, { message: 'Passwords do not match' });
		}

		// todo: validate username

		let { data: userData, error: userError } = await supabase
			.from('profiles')
			.select(`username`)
			.eq('username', username)

		if (userData?.length != 0) {
			return invalid(400, { message: 'Username taken' });
		
		} else if (userError) {
			console.dir(userError)
			return invalid(400, { message: userError?.message });
		}

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password
		});

		if (data) {
			await createProfile(username, data.user?.id);
		}

		await createProfile(username, data.user?.id);

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

async function createProfile(username: string, user_id?: string) {
	if (!user_id) return;

	const { error } = await supabase
		.from('profiles')
		.update({ username: username, updated_at: new Date() })
		.eq('id', user_id);

	console.log(error);
}
