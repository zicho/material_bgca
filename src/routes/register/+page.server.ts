import { setSession } from '$lib/core/helpers/sessionHelper';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, invalid } from '@sveltejs/kit';
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
		const { supabaseClient } = await getSupabase(event);

		const formData = await request.formData();
		const email = (formData.get('email') as string).trim();
		const username = (formData.get('username') as string).trim();
		const password = (formData.get('password') as string).trim();
		const password_confirm = (formData.get('password_confirm') as string).trim();

		if (
			typeof email != 'string' ||
			typeof username != 'string' ||
			typeof password != 'string' ||
			!email ||
			!username ||
			!password
		) {
			return invalid(400, { message: 'Incorrect data in input fields', username, email });
		}

		if (password != password_confirm) {
			return invalid(400, { message: 'Passwords do not match', username, email });
		}

		// todo: validate username

		let { data: userData, error: userError } = await supabaseClient
			.from('profiles')
			.select(`username`)
			.eq('username', username);

		if (userData?.length != 0) {
			return invalid(400, { message: 'Username taken', username, email });
		} else if (userError) {
			return invalid(400, { message: userError?.message });
		}

		const { data, error } = await supabaseClient.auth.signUp({
			email: email,
			password: password
		});

		await supabaseClient
			.from('profiles')
			.update({ username: username, email: email, updated_at: new Date() })
			.eq('id', data.user?.id);

		await supabaseClient.auth.updateUser({
			data: { username: username }
		});

		// if (data) {
		// 	await createProfile(username, data.user?.email as string, data.user?.id);
		// }

		if (data.session) {
			setSession(event, data.session.access_token);
			throw redirect(302, '/');
		} else {
			return invalid(400, { message: error?.message, username, email });
		}
	}
};
