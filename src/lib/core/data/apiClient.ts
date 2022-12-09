import supabase from './supabase';
import type { IProfile } from '../interfaces/IProfile';
import type { IMessage } from '../interfaces/IMessage';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { RequestEvent } from '@sveltejs/kit';

export default function getClient(event: RequestEvent) {
	return new ApiClient(event);
}

class ApiClient {
	event: RequestEvent;
	supabase = async () => await getSupabase(this.event);

	constructor(event: any) {
		this.event = event;
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

	async userExists(username: string): Promise<boolean> {
		let { data, error } = await supabase
			.from('profiles')
			.select(`username`)
			.eq('username', username);
		return data?.length != 0;
	}
}
