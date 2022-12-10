import { clearSession } from '$lib/core/helpers/sessionHelper';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	throw redirect(302, '/');
};

export const actions: Actions = {
	default(event) {
        clearSession(event);
        throw redirect(302, '/login');
    }
};
