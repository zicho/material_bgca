import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { IProfile } from './interfaces/IProfile';
import supabase from './supabase';

export async function getProfile(username: string): Promise<IProfile> {
	const { data, error } = await supabase
		.from('profiles')
		.select('description')
		.eq('username', username)
		.single();

	return {
		description: data?.description
	};
}

export async function updateProfileDescription(
	username: string,
	description: string
): Promise<void> {
	const { data, error } = await supabase
		.from('profiles')
		.update({ description: description })
		.match({ username: username });
}

export async function userExists(username: string): Promise<boolean> {
	let { data, error } = await supabase.from('profiles').select(`username`).eq('username', username);
	return data?.length != 0;
}

export async function sendMessage(from: string, to: string, content: string) {
	const { error } = await supabase
		.from('messages')
		.insert({ content: content, sender: from, recipient: to });
}

export async function getUnreadMessageCount(username: string) {
	const { data } = await supabase
		.from('messages')
		.select('*')
		.eq('read', false)
		.eq('recipient', username);

	return data?.length;
}
