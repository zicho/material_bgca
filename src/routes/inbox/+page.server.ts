import { deleteMessages, markMessagesAsRead, getInboxTotalMessageCount, getMessages } from '$lib/core/data/api';
import { handleSort } from '$lib/core/helpers/tableSorter';
import type { IMessage } from '$lib/core/interfaces/IMessage';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad = async (event) => {

	const { url, locals } = event;
	const { session } = await getSupabase(event);

	if (!session) {
		throw redirect(303, '/login');
	}

	let limit = 10;

	let pageNo = (url.searchParams.get('page') as unknown) as number;
	let sort = (url.searchParams.get('sort') as string) as keyof IMessage;

	if (isNaN(+pageNo) || !pageNo) {
		pageNo = 0;
	}

	let messages = await getMessages(pageNo, limit);
    let totalMessages = await getInboxTotalMessageCount(locals.userinfo?.username as string);

	if (sort) {
		messages = handleSort(messages, sort);
	}

    let lastPage = Math.max(Math.ceil(totalMessages / limit) - 1, 0);

    // todo: bug: pagination returns last item from previous page
	
	return {
		messages,
		pageNo: +pageNo,
		sortQuery: sort ? sort : 'sender',
        onFirstPage: pageNo == 0,
        onLastPage: messages.length != limit,
        lastPage,
        totalMessages,
		limit
	};
};

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	change_page: async ({ request, cookies }: any) => {
		const formData = await request.formData();
		const page_no = formData.get('page_no');
		throw redirect(302, `/inbox?page=${+page_no}`);
	},
	delete: async ({ request, cookies }: any) => {
		const formData = await request.formData();
		
		const id = formData.get('id');

		await deleteMessages([id])
	},
	mark_read: async ({ request, cookies }: any) => {
		const formData = await request.formData();
		
		const id = formData.get('id');

		await markMessagesAsRead([id])
	},
};
