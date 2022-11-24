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
