<script lang="ts">
	import type { PageData } from './$types';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import DataTable, {
		Cell as TableCell,
		Head,
		Body,
		Row,
		Pagination,
		SortValue
	} from '@smui/data-table';
	import Checkbox from '@smui/checkbox';
	import Select, { Option } from '@smui/select';
	import IconButton from '@smui/icon-button';
	import { Label } from '@smui/common';
	import type { IMessage } from '$lib/core/interfaces/IMessage';
	import Icon from '@smui/textfield/icon';
	import { onMount } from 'svelte';
	import { handleSort } from '$lib/core/helpers/tableSorter';
	import { enhance } from '$app/forms';
	import { deleteMessages, getMessages, markMessagesAsRead } from '$lib/core/data/api';
	import Button from '@smui/button';
	import { unreadMessages } from '$lib/stores/messages';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	let javascriptOn = false;

	onMount(() => (javascriptOn = true));

	let items = data.messages;

	let rowsPerPage = data.limit;

	$: {
		unreadMessages.set(data.unreadMessages);
	}

	$: start = data.pageNo * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, items.length);
	$: slice = data.messages.slice(start, end);
	$: lastPage = Math.max(Math.ceil(items.length / rowsPerPage) - 1, 0);

	$: if (data.pageNo > lastPage) {
		data.pageNo = lastPage;
	}

	let currentPage = data.pageNo;

	let sort: keyof IMessage = data.sortQuery ? data.sortQuery : 'sender';
	let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';
	let loading: boolean = false;

	const next_page = async () => {
		loading = true;
		currentPage = currentPage + 1;
		items = await getMessages(currentPage, rowsPerPage, data.userinfo?.username);
		loading = false;
	};

	const prev_page = async () => {
		loading = true;
		currentPage = currentPage - 1;
		items = await getMessages(currentPage, rowsPerPage, data.userinfo?.username);
		loading = false;
	};

	const goto_page = async (page: number) => {
		loading = true;
		currentPage = page;
		items = await getMessages(page, rowsPerPage, data.userinfo?.username);
		loading = false;
	};

	const deleteMany = async () => {
		let ids = selectedItems.map((x) => x.id);
		await deleteMessages(ids);
		resetSelection();
		invalidateAll();
	};

	const readMany = async () => {
		let ids = selectedItems.map((x) => x.id);
		await markMessagesAsRead(ids);
		resetSelection();
		invalidateAll();
	};

	const resetSelection = () => {
		selectedItems = []
		allSelected=false;
	}

	let allSelected: boolean = true;

	items = handleSort(items, sort, sortDirection);

	let selectedItems: IMessage[] = [];

	const updateSort = () => (data.messages = handleSort(data.messages, sort, sortDirection));
</script>

<svelte:head>
	<title>Inbox</title>
</svelte:head>

<LayoutGrid>
	<Cell spanDevices={{ desktop: 12, tablet: 8, phone: 4 }}>
		<div class="mb-xxs mdc-typography--headline2">Inbox</div>
	</Cell>
	<Cell spanDevices={{ desktop: 12, tablet: 8, phone: 4 }}>
		<DataTable
			sortable
			bind:sort
			bind:sortDirection
			on:SMUIDataTable:sorted={updateSort}
			table$aria-label="User list"
			style="width: 100%;"
			href="/"
		>
			<Head>
				<Row>
					{#if javascriptOn}
						<TableCell checkbox >
							<Checkbox />
						</TableCell>
					{/if}
					<TableCell columnId="sender">
						<Label>From</Label>
						{#if javascriptOn}<IconButton class="material-icons">arrow_upward</IconButton>{/if}
					</TableCell>
					<TableCell columnId="content">
						<Label>Content</Label>
						{#if javascriptOn} <IconButton class="material-icons">arrow_upward</IconButton>{/if}
					</TableCell>
					<TableCell columnId="read">
						<Label>Read</Label>
						{#if javascriptOn}<IconButton class="material-icons">arrow_upward</IconButton>{/if}
					</TableCell>
					<TableCell columnId="delete" />
					<TableCell columnId="mark_read" />
				</Row>
			</Head>

			<Body target="/">
				{#each slice as item}
					<Row href="/">
						{#if javascriptOn}
							<TableCell checkbox>
								<Checkbox
									bind:group={selectedItems}
									input$id={String(item.id)}
									value={item}
									valueKey={item.content}
								/>
							</TableCell>
						{/if}
						<TableCell>{item.sender}</TableCell>
						<TableCell style="width: 100%;"><a href="/">{item.content}</a></TableCell>
						<TableCell>
							{#if item.read}
								<Icon class="material-icons green">check</Icon>
							{:else}
								<Icon class="material-icons red">close</Icon>
							{/if}
						</TableCell>
						<TableCell>
							<form action="?/delete" method="post" use:enhance>
								<input type="hidden" name="id" value={item.id} />
								<Button>
									<Icon class="material-icons grey">delete</Icon>
								</Button>
							</form>
						</TableCell>
						<TableCell>
							<form action="?/mark_read" method="post" use:enhance>
								<input type="hidden" name="id" value={item.id} />
								<Button disabled={item.read}>
									<Icon class="material-icons grey">{item.read ? 'drafts' : 'mark_email_read'}</Icon
									>
								</Button>
							</form>
						</TableCell>
					</Row>
				{/each}
			</Body>

			<Pagination slot="paginate">
				<svelte:fragment slot="rowsPerPage">
					{#if javascriptOn}
						<div style="position: absolute; left: 0" class="ml-xs">
							<Button on:click={deleteMany}>Delete marked</Button>
							<Button on:click={readMany}>Mark as read</Button>
						</div>
					{/if}

					<Label>Rows per page:</Label>
					{#if javascriptOn}
						<Select disabled variant="outlined" bind:value={rowsPerPage} noLabel>
							<Option value={10}>10</Option>
							<Option value={25}>25</Option>
							<Option value={100}>100</Option>
						</Select>
					{:else}
						<Label>10</Label>
					{/if}
				</svelte:fragment>

				<svelte:fragment slot="total">
					Page {currentPage + 1} of {data.lastPage + 1}
				</svelte:fragment>

				<form method="POST" action="?/change_page" use:enhance={() => goto_page(0)}>
					<input type="hidden" name="page_no" value={0} />
					<IconButton
						class="material-icons"
						action="first-page"
						title="First page"
						disabled={currentPage === 0 || loading}>first_page</IconButton
					>
				</form>

				<form method="POST" action="?/change_page" use:enhance={prev_page}>
					<input type="hidden" name="page_no" value={currentPage - 1} />
					<IconButton
						class="material-icons"
						action="prev-page"
						title="Previous page"
						disabled={data.onFirstPage || loading}>chevron_left</IconButton
					>
				</form>
				<form method="POST" action="?/change_page" use:enhance={next_page}>
					<input type="hidden" name="page_no" value={currentPage + 1} />
					<IconButton
						class="material-icons"
						action="next-page"
						title="Next page"
						disabled={data.onLastPage || loading}>chevron_right</IconButton
					>
				</form>

				<form method="POST" action="?/change_page" use:enhance={() => goto_page(data.lastPage)}>
					<input type="hidden" name="page_no" value={data.lastPage} />
					<IconButton
						class="material-icons"
						action="last-page"
						title="Last page"
						on:click={() => (data.pageNo = lastPage)}
						disabled={data.onLastPage || loading}>last_page</IconButton
					>
				</form>
			</Pagination>
		</DataTable>
	</Cell>
</LayoutGrid>

<style lang="scss">
	@use '@material/theme/color-palette';

	:global(.mdc-text-field__icon.red) {
		color: color-palette.$red-900 !important;
	}

	:global(.mdc-text-field__icon.green) {
		color: color-palette.$green-900 !important;
	}

	:global(.mdc-text-field__icon.grey) {
		color: color-palette.$grey-600 !important;
	}
</style>
