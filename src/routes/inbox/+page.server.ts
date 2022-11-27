import { getMessages } from '$lib/core/data/api';
import { handleSort } from '$lib/core/helpers/tableSorter';
import type { IMessage } from '$lib/core/interfaces/IMessage';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, request, url }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	let pageNo = (url.searchParams.get('page') as unknown) as number;
	let sort = (url.searchParams.get('sort') as string) as keyof IMessage;

	if (isNaN(+pageNo) || !pageNo) {
		pageNo = 0;
	}

	let messages = await getMessages(pageNo, locals.userinfo?.username);

	if (sort) {
		messages = handleSort(messages, sort);
	}

	console.dir("page " + +pageNo);

	return {
		messages,
		pageNo: +pageNo,
		sortQuery: sort ? sort : 'sender'
	};
};

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	next_page: async ({ request, cookies }: any) => {
		const formData = await request.formData();
		const page_no = formData.get('page_no');
		console.dir("post: " + +page_no);
		throw redirect(302, `/inbox?page=${+page_no}`);
	}
};
