import type { IProfile } from '../interfaces/IProfile';
import type { IMessage } from '../interfaces/IMessage';
import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit';

export default function getClient(event: RequestEvent) {
	return new ApiClient(event);
}

class ApiClient {
	event: RequestEvent;

	constructor(event: any) {
		this.event = event;
	}

	async getProfile(username: string): Promise<IProfile> {
		const { supabaseClient } = await getSupabase(this.event);
		const { data, error } = await supabaseClient
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

	async getMessages(page: number = 0, limit: number = 10): Promise<IMessage[]> {
		const { from, to } = getPagination(page, limit);
		const { supabaseClient } = await getSupabase(this.event);
		const { data, error } = await supabaseClient
			.from('messages')
			.select('*')
			.order('read', { ascending: true })
			.order('id', { ascending: true })
			.range(from, to);

		return data as IMessage[];
	}

	async deleteMessages(ids: number[]) {
		const { supabaseClient } = await getSupabase(this.event);
		const { data, error } = await supabaseClient.from('messages').delete().in('id', ids);
	}

	async markMessagesAsRead(ids: number[]) {
		const { supabaseClient } = await getSupabase(this.event);
		const { data, error } = await supabaseClient
			.from('messages')
			.update({ read: true })
			.in('id', ids);
	}

	async getInboxTotalMessageCount(username: string): Promise<number> {
		const { supabaseClient } = await getSupabase(this.event);
		const { data, error } = await supabaseClient
			.from('messages')
			.select('*')
			.eq('recipient', username);

		return data?.length as number;
	}

	async userExists(username: string): Promise<boolean> {
		const { supabaseClient } = await getSupabase(this.event);
		const { data, error } = await supabaseClient
			.from('profiles')
			.select(`username`)
			.eq('username', username);
		return data?.length != 0;
	}

	async getUnreadMessageCount(username: string): Promise<number> {
		const { supabaseClient } = await getSupabase(this.event);
		const { data, error } = await supabaseClient
			.from('messages')
			.select('*')
			.eq('read', false)
			.eq('recipient', username);

		return data?.length as number;
	}

	async getUserNameByEmail(email: string) {
		const { supabaseClient } = await getSupabase(this.event);
		const { data, error } = await supabaseClient
			.from('profiles')
			.select(`username`)
			.eq('email', email)
			.single();

		return data?.username;
	}

	async updateProfileDescription(username: string, description: string): Promise<void> {
		const { supabaseClient } = await getSupabase(this.event);
		const { data, error } = await supabaseClient
			.from('profiles')
			.update({ description: description })
			.match({ username: username });

		console.dir(error);
	}

	async sendMessage(from: string, to: string, content: string) {
		const { supabaseClient } = await getSupabase(this.event);
		const recipient = (
			await supabaseClient.from('profiles').select('id').eq('username', to).single()
		).data;

		const { error } = await supabaseClient
			.from('messages')
			.insert({ content: content, sender: from, recipient: to, recipient_id: recipient?.id });

		if (error) {
			console.log(error);
		}
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
