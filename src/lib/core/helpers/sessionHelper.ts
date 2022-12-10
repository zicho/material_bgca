import type { RequestEvent } from '@sveltejs/kit';

// shorthand to retrieve just the token without any of the other content in supabase
// todo: maybe make a helper to extract this from auth_token instead to avoid having two
export const COOKIE_NAME = 'session_token';
const supabase_session = 'supabase-auth-token';

export const clearSession = (event: RequestEvent) => {
	event.cookies.delete(COOKIE_NAME);
	event.cookies.delete(supabase_session);
};

export const setSession = (event: RequestEvent, token: string) => {
	event.cookies.set(COOKIE_NAME, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV == 'production',
		maxAge: 60 * 60 * 24 * 30
	});
};
