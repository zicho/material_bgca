import supabase from '$lib/core/data/supabase';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { invalid, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	default: async (event) => {

		const { request, cookies, url } = event

		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { session, supabaseClient } = await getSupabase(event)

		const { error } = await supabaseClient.auth.signInWithPassword({

			email,
	  
			password,
	  
		  })

		if (session) {
			cookies.set('session', session.access_token, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV == 'production',
				maxAge: 60 * 60 * 24 * 30
			});

			throw redirect(302, '/');
		} else {
			return invalid(400, { message: error?.message, email: email });
		}
	}
};
