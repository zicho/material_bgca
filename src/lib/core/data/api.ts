import supabase from './supabase';
import type { IProfile } from '../interfaces/IProfile';
import type { IMessage } from '../interfaces/IMessage';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { RequestEvent } from '@sveltejs/kit';

// TODO: As this grows, maybe add a little structure

export class ApiClient {
	event: RequestEvent;
	supabase = async () => await getSupabase(this.event);

	constructor(event: any) {
		this.event = event;
	}

	async updateProfileDescription(username: string, description: string): Promise<void> {
		const { error } = await supabase
			.from('profiles')
			.update({ description: description })
			.match({ username: username });

		if (error) {
			console.log(error);
		}
	}

	async getProfile(username: string): Promise<IProfile> {
		const { data, error } = await supabase
			.from('profiles')
			.select('description')
			.eq('username', username)
			.single();

		if (error) {
			console.log(error);
		}

		return {
			description: data?.description
		};
	}

	async deleteMessages(ids: number[]) {
		const { error } = await supabase.from('messages').delete().in('id', ids);
		if (error) {
			console.log(error);
		}
	}

	async markMessagesAsRead(ids: number[]) {
		const { error } = await supabase.from('messages').update({ read: true }).in('id', ids);
		if (error) {
			console.log(error);
		}
	}

	async userExists(username: string): Promise<boolean> {
		let { data, error } = await supabase
			.from('profiles')
			.select(`username`)
			.eq('username', username);

		if (error) {
			console.log(error);
		}

		return data?.length != 0;
	}

	async sendMessage(from: string, to: string, content: string) {
		const { error } = await supabase
			.from('messages')
			.insert({ content: content, sender: from, recipient: to });

		if (error) {
			console.log(error);
		}
	}

	async getUnreadMessageCount(username: string): Promise<number> {
		const { data, error } = await supabase
			.from('messages')
			.select('*')
			.eq('read', false)
			.eq('recipient', username);

		if (error) {
			console.log(error);
		}

		return data?.length as number;
	}

	async getInboxTotalMessageCount(username: string): Promise<number> {
		const { data, error } = await supabase.from('messages').select('*').eq('recipient', username);

		if (error) {
			console.log(error);
		}

		return data?.length as number;
	}

	async getUserNameByEmail(email: string) {
		let { data, error } = await supabase
			.from('profiles')
			.select(`username`)
			.eq('email', email)
			.single();

		if (error) {
			console.log(error);
		}

		return data?.username;
	}

	async getMessages(page: number = 0, limit: number = 10, username?: string): Promise<IMessage[]> {
		const { from, to } = getPagination(page, limit);
		const { data, error } = await supabase
			.from('messages')
			.select('*')


		if (error) {
			console.log(error);
		}

		console.dir(data)

		return data as IMessage[];
	}
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
