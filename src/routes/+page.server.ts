import getClient from '$lib/core/data/apiClient';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { session } = await getSupabase(event);

	if (!session) {
		throw redirect(303, '/login');
	}

	let data = await getClient(event).getUserList();

	return {
		userList: data as string[]
	}
};
