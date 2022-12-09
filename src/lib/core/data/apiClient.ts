import type { IProfile } from '../interfaces/IProfile';
import type { IMessage } from '../interfaces/IMessage';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { RequestEvent } from '@sveltejs/kit';

export default function getClient(event: RequestEvent) {
	return new ApiClient(event);
}

class ApiClient {
	event: RequestEvent;

	constructor(event: any) {
		this.event = event;
	}


	async getProfile(username: string): Promise<IProfile> {

		const { supabaseClient } = await getSupabase(this.event)
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

	async userExists(username: string): Promise<boolean> {
		const { supabaseClient } = await getSupabase(this.event)
		const { data, error } = await supabaseClient
			.from('profiles')
			.select(`username`)
			.eq('username', username);
		return data?.length != 0;
	}

	async getUnreadMessageCount(username: string): Promise<number> {
		const { supabaseClient } = await getSupabase(this.event)
		const { data, error } = await supabaseClient
			.from('messages')
			.select('*')
			.eq('read', false)
			.eq('recipient', username);

		return data?.length as number;
	}

	async getUserNameByEmail(email: string) {
		const { supabaseClient } = await getSupabase(this.event)
		const { data, error } = await supabaseClient
			.from('profiles')
			.select(`username`)
			.eq('email', email)
			.single();

		return data?.username;
	}

	async updateProfileDescription(username: string, description: string): Promise<void> {
		const { supabaseClient } = await getSupabase(this.event)
		const { data, error } = await supabaseClient
			.from('profiles')
			.update({ description: description })
			.match({ username: username });

		console.dir(error);
	}
}
