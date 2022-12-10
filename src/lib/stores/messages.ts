import { getUnreadMessageCount, getUserNameByEmail } from '$lib/core/data/api';
import { trimIfNecessary } from '$lib/core/helpers/stringHelper';
import { notifySuccess } from '$lib/core/notify';
import supabase from '$lib/core/data/supabase';
import { writable } from 'svelte/store';

export let unreadMessages = writable(0);

let _username: string;

export async function subscribeViaEmail(email: string) {
	const username = await getUserNameByEmail(email);
	await subscribeToMessages(username);
}

export async function subscribeToMessages(username: string) {
	// todo: type it up? 

	console.dir("subscribed!")

	_username = username;
	unreadMessages.set((await getUnreadMessageCount(_username)) as number);

	supabase
		.channel('messages')
		.on('postgres_changes', { event: 'INSERT', schema: 'public' }, async (payload) => {
			if (payload.new.recipient == _username) {
				console.log("message received!")
				unreadMessages.set((await getUnreadMessageCount(_username)) as number);
				notifySuccess(
					`${payload.new.sender} sent you a message!`,
					trimIfNecessary(payload.new.content, 20)
				);
			}
		})
		.subscribe();
}
