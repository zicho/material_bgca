import supabase from '$lib/core/data/supabase';

export async function unsubscribeAll() {
	supabase
		.channel('messages')
		.unsubscribe();
}
