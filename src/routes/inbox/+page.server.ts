import { deleteMessages, markMessagesAsRead, getInboxTotalMessageCount, getMessages, getUnreadMessageCount } from '$lib/core/data/api';
import { handleSort } from '$lib/core/helpers/tableSorter';
import type { IMessage } from '$lib/core/interfaces/IMessage';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, request, url }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	console.log("load")

	let pageNo = (url.searchParams.get('page') as unknown) as number;
	let sort = (url.searchParams.get('sort') as string) as keyof IMessage;

	if (isNaN(+pageNo) || !pageNo) {
		pageNo = 0;
	}

	let messages = await getMessages(pageNo, locals.userinfo?.username);
    let totalMessages = await getInboxTotalMessageCount(locals.userinfo?.username as string);
	let unreadMessages = await getUnreadMessageCount(locals.userinfo?.username as string);

	if (sort) {
		messages = handleSort(messages, sort);
	}

    let lastPage = Math.max(Math.ceil(totalMessages / 10) - 1, 0);

    // todo: bug: pagination returns last item from previous page
	
	return {
		messages,
		pageNo: +pageNo,
		sortQuery: sort ? sort : 'sender',
        onFirstPage: pageNo == 0,
        onLastPage: messages.length != 10,
        lastPage,
        totalMessages,
		unreadMessages
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
