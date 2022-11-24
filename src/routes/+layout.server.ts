import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {

    // todo: load unread messages

    return {
        user: locals.user,
        userinfo: locals.userinfo,
        // messageCount: 
    }
};
