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
	import { Title, Content, Actions } from '@smui/dialog';
	import { Label } from '@smui/common';
	import type { IMessage } from '$lib/core/interfaces/IMessage';
	import Icon from '@smui/textfield/icon';
	import { onMount } from 'svelte';
	import { handleSort } from '$lib/core/helpers/tableSorter';
	import { applyAction, enhance } from '$app/forms';
	import {
		deleteMessages,
		getMessages,
		getUnreadMessageCount,
		markMessagesAsRead
	} from '$lib/core/data/api';
	import Button from '@smui/button';
	import { unreadMessages } from '$lib/stores/messages';
	import { invalidateAll } from '$app/navigation';
	import { browser } from '$app/environment';

	export let data: PageData;

	let javascriptOn = false;

	onMount(() => (javascriptOn = true));

	let items = data.messages;
	let rowsPerPage = data.rowsPerPage;
	let hide = false;

	$: onChange($unreadMessages);

	function onChange(messageCount: number) {
		refreshInbox();
	}

	// $: refreshInbox(items)

	$: start = data.pageNo * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, items.length);
	$: slice = data.messages.slice(start, end);
	$: lastPage = Math.max(Math.ceil(items.length / rowsPerPage) - 1, 0);

	$: if (data.pageNo > lastPage) {
		data.pageNo = lastPage;
	}

	let currentPage = data.pageNo;

	let sort: keyof IMessage = 'id';
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
		refreshInbox();
		resetSelection();
		invalidateAll();
	};

	const refreshInbox = async () => {
		console.log('inbox refreshing...');
		data.messages = await getMessages(currentPage, rowsPerPage);
		$unreadMessages = await getUnreadMessageCount();
		items = data.messages;
	};

	const readMany = async () => {
		let ids = selectedItems.map((x) => x.id);
		await markMessagesAsRead(ids);
		resetSelection();
		refreshInbox();
		invalidateAll();
	};

	const resetSelection = () => {
		selectedItems = [];
		allSelected = false;
	};

	let allSelected: boolean = true;
	let selectedItems: IMessage[] = [];
	const updateSort = () => (data.messages = handleSort(data.messages, sort, sortDirection));

	if (browser) {
		unreadMessages.subscribe(async () => {
			refreshInbox();
		});
	}
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
		>
			<Head>
				<Row>
					{#if javascriptOn}
						<TableCell checkbox>
							<Checkbox disabled={items.length == 0} checked={allSelected} />
						</TableCell>
					{/if}
					<TableCell columnId="sender">
						<Label>From</Label>
						{#if javascriptOn && items.length != 0}<IconButton class="material-icons"
								>arrow_upward</IconButton
							>{/if}
					</TableCell>
					<TableCell columnId="content">
						<Label>Content</Label>
						{#if javascriptOn && items.length != 0}
							<IconButton class="material-icons">arrow_upward</IconButton>{/if}
					</TableCell>
					<TableCell columnId="read">
						<Label>Read</Label>
						{#if javascriptOn && items.length != 0}<IconButton class="material-icons"
								>arrow_upward</IconButton
							>{/if}
					</TableCell>
					<TableCell columnId="delete" />
					<TableCell columnId="mark_read" />
				</Row>
			</Head>

			<Body target="/">
				{#if items.length != 0}
					{#each slice as item}
						<Row>
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
							<TableCell style="width: 100%;"><a href="profile/{item.sender}">{item.sender}</a></TableCell>
							<TableCell style="width: 100%;"><a href="/">{item.content}</a></TableCell>
							<TableCell>
								{#if item.read}
									<Icon class="material-icons green">check</Icon>
								{:else}
									<Icon class="material-icons red">close</Icon>
								{/if}
							</TableCell>
							<TableCell>
								<form
									id="form-{String(item.id)}"
									action="?/delete"
									method="post"
									use:enhance={() => {
										hide = true;
										return async ({ result }) => {
											await applyAction(result);
											refreshInbox();
										};
									}}
								>
									<input type="hidden" name="id" value={item.id} />
									<input type="submit" id={String(item.id)} class="hide" />
									<Button href="#popup-{String(item.id)}" on:click={() => (hide = false)}>
										<Icon class="material-icons grey">delete</Icon>
									</Button>
								</form>
							</TableCell>
							<TableCell>
								<form
									action="?/mark_read"
									method="post"
									use:enhance={() => {
										return async ({ result }) => {
											await applyAction(result);
											refreshInbox();
										};
									}}
								>
									<input type="hidden" name="id" value={item.id} />
									<Button disabled={item.read}>
										<Icon class="material-icons grey"
											>{item.read ? 'drafts' : 'mark_email_read'}</Icon
										>
									</Button>
								</form>
							</TableCell>
						</Row>
					{/each}
				{:else}
					<Row>
						<TableCell style="width 100%">You have no messages.</TableCell>
					</Row>
				{/if}
			</Body>

			<Pagination slot="paginate">
				<svelte:fragment slot="rowsPerPage">
					{#if javascriptOn}
						<div style="position: absolute; left: 0" class="ml-xs">
							<Button disabled={selectedItems.length == 0} on:click={deleteMany}
								>Delete marked</Button
							>
							<Button disabled={selectedItems.length == 0} on:click={readMany}>Mark as read</Button>
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
					Page {currentPage} of {data.lastPage}
				</svelte:fragment>

				<form method="POST" action="?/change_page" use:enhance={() => goto_page(1)}>
					<input type="hidden" name="page_no" value={1} />
					<IconButton
						class="material-icons"
						action="first-page"
						title="First page"
						disabled={data.onFirstPage || loading}>first_page</IconButton
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

<!-- <Dialog id="popup1" class="overlay" aria-labelledby="simple-title" aria-describedby="simple-content">
	<Title id="simple-title">Dialog Title</Title>
	<Content id="simple-content">Super awesome dialog body text?</Content>
	<Actions>
		<Button>
			<Label>No</Label>
		</Button>
		<Button>
			<Label>Yes</Label>
		</Button>
	</Actions>
</Dialog> -->

{#if !hide}
	{#each items as item}
		<div id="popup-{String(item.id)}" class="overlay">
			<!-- svelte-ignore a11y-missing-content -->
			<a class="cancel" href="#" />
			<div class="popup">
				<Title class="mb-md" id="simple-title">Deleting message</Title>
				<Content id="simple-content">Do you want to delete this message?</Content>
				<Actions>
					<Button href="#">
						<Label>No</Label>
					</Button>
					<Button type="submit" form="form-{String(item.id)}">Yes</Button>
				</Actions>
			</div>
		</div>
	{/each}
{/if}

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

	.overlay {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.5);
		transition: opacity 200ms;
		visibility: hidden;
		opacity: 0;
		.cancel {
			position: absolute;
			width: 100%;
			height: 100%;
			cursor: default;
		}
		&:target {
			visibility: visible;
			opacity: 1;
		}
	}

	:global(.mdc-dialog__title) {
		padding: 0 !important;
	}

	.popup {
		margin: 75px auto;
		padding: 0px 20px;
		background: #fff;
		border: 1px solid #666;
		width: 300px;
		box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
		position: relative;
	}
</style>
