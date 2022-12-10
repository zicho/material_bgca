import supabase from './supabase';

export async function getUnreadMessageCount(username: string): Promise<number> {
	const { data } = await supabase
		.from('messages')
		.select('*')
		.eq('read', false)
		.eq('recipient', username);

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