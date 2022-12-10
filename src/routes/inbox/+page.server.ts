import { handleSort } from '$lib/core/helpers/tableSorter';
import type { IMessage } from '$lib/core/interfaces/IMessage';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import getClient from '$lib/core/data/apiClient';

export const load: PageServerLoad = async (event) => {
	const { url, locals } = event;
	const { session } = await getSupabase(event);

	if (!session) {
		throw redirect(303, '/login');
	}

	let rowsPerPage = 10;

	let pageNo = (url.searchParams.get('page') as unknown) as number;

	if (isNaN(+pageNo) || !pageNo) {
		pageNo = 0;
	}

	let messages = await getClient(event).getMessages(pageNo, rowsPerPage);

	let totalMessages = await getClient(event).getInboxTotalMessageCount(
		locals.userinfo?.username as string
	);

	let lastPage = Math.max(Math.ceil(50 / rowsPerPage), 0);

	return {
		messages,
		pageNo: +pageNo,
		onFirstPage: pageNo == 0,
		onLastPage: messages.length != rowsPerPage,
		lastPage,
		totalMessages,
		rowsPerPage
	};
};

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	change_page: async ({ request, cookies }: any) => {
		const formData = await request.formData();
		const page_no = formData.get('page_no');
		throw redirect(302, `/inbox?page=${+page_no}`);
	},
	delete: async (event) => {
		const formData = await event.request.formData();

		const id = formData.get('id') as unknown as number;

		await getClient(event).deleteMessages([id]);
	},
	mark_read: async (event) => {
		const formData = await event.request.formData();

		const id = formData.get('id')  as unknown as number;

		await getClient(event).markMessagesAsRead([id]);
	}
};
