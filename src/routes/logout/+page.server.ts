import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	throw redirect(302, '/');
};

export const actions: Actions = {
	default({ cookies }) {

        cookies.set('session', '', {
            path: "/",
            expires: new Date(0)
        })

        cookies.set('supabase-auth-token', '', {
            path: "/",
            expires: new Date(0)
        })

        throw redirect(302, '/login');
    }
};
