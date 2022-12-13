import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import getApiClient from '$lib/core/data/apiClient';

export const load: PageServerLoad = async (event) => {
	const { session } = await getSupabase(event);

	if (!session) {
		throw redirect(302, '/login');
	}

	const { locals, params } = event;

	let client = getApiClient(event)

	if (!(await client.userExists(params.username))) {
		throw error(404, 'This user does not seem to exist.');
	}

	var profile = await client.getProfile(params.username);
	
	const { supabaseClient } = await getSupabase(event);
	const { data: avatarUrl } = supabaseClient.storage.from('avatars').getPublicUrl(profile?.avatar_url)

	return {
		slug: params.username,
		username: locals.userinfo?.username,
		profile: profile,
		isYourPage: locals.userinfo?.username == params.username,
		avatarUrl: avatarUrl.publicUrl
	};
};

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
    default: async (event) => {
        const { request } = event;
        const formData = await request.formData();

		
        const file = formData.get('avatar') as Blob;

		console.dir(file)
        const fileExt = file.name.split('.').pop();
        const filePath = `user_${event.locals.userinfo?.username}_avatar.${fileExt}`;


        const { supabaseClient } = await getSupabase(event);
        await supabaseClient.storage.from('avatars').upload(filePath, file);

        await supabaseClient
            .from('profiles')
            .update({ avatar_url: filePath })
            .eq('username', event.locals.userinfo?.username);

        await supabaseClient.storage.from('avatars').download(filePath);
    }
};
