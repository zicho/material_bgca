import { getUnreadMessageCount } from '$lib/core/api';
import supabase from '$lib/core/supabase';
import { writable } from 'svelte/store';

export let unreadMessages = writable(0);

let _username: string;

export async function subscribeToMessages(username: string) {
	// todo: type it up? payload is "any"
	_username = username;

	unreadMessages.set((await getUnreadMessageCount(_username)) as number);

	supabase
		.channel('messages')
		.on('postgres_changes', { event: '*', schema: '*' }, async (payload: any) => {

			console.log(payload)

			if (payload.new.recipient == _username) {
				console.log("hit!")
				unreadMessages.set((await getUnreadMessageCount(_username)) as number);
			}
		})
		.subscribe();

	console.log("subscribed")
}
