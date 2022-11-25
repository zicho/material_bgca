import { getUnreadMessageCount } from '$lib/core/api';
import { notifySuccess } from '$lib/core/notify';
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
			if (payload.new.recipient == _username) {
				unreadMessages.set((await getUnreadMessageCount(_username)) as number);
				notifySuccess(
					`${payload.new.sender} sent you a message!`,
					payload.new.content.length > 20
						? `${payload.new.content.slice(0, 20)}...`
						: `${payload.new.content}`
				);
			}
		})
		.subscribe();
}
