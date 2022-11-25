import supabase from '$lib/core/supabase';

export async function unsubscribeAll() {
	supabase
		.channel('messages')
		.unsubscribe();
}
