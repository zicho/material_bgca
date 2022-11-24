import { getUnreadMessageCount } from '$lib/core/api';
import supabase from '$lib/core/supabase';
import Notify from 'simple-notify';
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
				new Notify({
					status: 'success',
					title: `${payload.new.sender} sent you a message!`,
					text:
						payload.new.content.length > 20
							? `${payload.new.content.slice(0, 20)}...`
							: `${payload.new.content}`,
					effect: 'fade',
					speed: 300,
					showIcon: true,
					showCloseButton: true,
					autoclose: true,
					autotimeout: 3000,
					gap: 20,
					distance: 20,
					type: 1,
					position: 'right bottom'
				});
			}
		})
		.subscribe();
}
