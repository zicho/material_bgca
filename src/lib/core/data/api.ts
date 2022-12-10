import supabase from './supabase';
import type { IProfile } from '../interfaces/IProfile';
import type { IMessage } from '../interfaces/IMessage';

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

export async function userExists(username: string): Promise<boolean> {
	let { data, error } = await supabase.from('profiles').select(`username`).eq('username', username);
	return data?.length != 0;
}

export async function sendMessage(from: string, to: string, content: string) {
	const { error } = await supabase
		.from('messages')
		.insert({ content: content, sender: from, recipient: to });
}

export async function getUnreadMessageCount(username: string): Promise<number> {
	const { data } = await supabase
		.from('messages')
		.select('*')
		.eq('read', false)
		.eq('recipient', username);

	return data?.length as number;
}

export async function getInboxTotalMessageCount(username: string): Promise<number> {
	const { data } = await supabase.from('messages').select('*').eq('recipient', username);

	return data?.length as number;
}

export async function getUserNameByEmail(email: string) {
	let { data, error } = await supabase
		.from('profiles')
		.select(`username`)
		.eq('email', email)
		.single();

	return data?.username;
}

const getPagination = (page: number, size: number) => {
	size--; // fix so limit returns properly... otherwise you get 11 instead of 10, for example. not sure why ¯\_(ツ)_/¯
	const val = Number(page);

	if (Number.isNaN(val)) {
		page = 0;
	}

	const limit = size ? +size : 3;
	const from = page ? page * limit : 0;
	const to = page ? from + size : size;

	return { from, to };
};

export async function getMessages(page: number = 0, limit: number = 10, username?: string): Promise<IMessage[]> {
	const { from, to } = getPagination(page, limit);

	console.dir(username)

	const { data } = await supabase
		.from('messages')
		.select('*')
		// .order('read', { ascending: true })
		// .order('id', { ascending: true })
		.eq('recipient', username)
		// .range(from, to);

	console.dir(data)

	return data as IMessage[];
}

export async function deleteMessages(ids: number[]) {
	const { data, error } = await supabase.from('messages').delete().in('id', ids);
}

export async function markMessagesAsRead(ids: number[]) {
	const { data, error } = await supabase.from('messages').update({ read: true }).in('id', ids);
}
