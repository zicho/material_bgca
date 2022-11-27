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
	import Select, { Option } from '@smui/select';
	import IconButton from '@smui/icon-button';
	import { Label } from '@smui/common';
	import type { IMessage } from '$lib/core/interfaces/IMessage';
	import Icon from '@smui/textfield/icon';
	import { onMount } from 'svelte';
	import { handleSort } from '$lib/core/helpers/tableSorter';
	import { enhance } from '$app/forms';
	import { getMessages } from '$lib/core/data/api';

	export let data: PageData;

	let javascriptOn = false;

	onMount(() => (javascriptOn = true));

	let items: IMessage[] = data.messages;
	let rowsPerPage = 10;

	$: start = data.pageNo * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, items.length);
	$: slice = items.slice(start, end);
	$: lastPage = Math.max(Math.ceil(items.length / rowsPerPage) - 1, 0);

	$: if (data.pageNo > lastPage) {
		data.pageNo = lastPage;
	}

	let currentPage = data.pageNo;

	let sort: keyof IMessage = data.sortQuery ? data.sortQuery : 'sender';
	let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';

	const next_page = async () => {
		currentPage = currentPage + 1;
		items = await getMessages(currentPage, data.userinfo?.username);
	};

	const prev_page = async () => {
		currentPage = currentPage - 1;
		items = await getMessages(currentPage, data.userinfo?.username);
	};

	const goto_page = async (page: number) => {
		currentPage = page;
		items = await getMessages(page, data.userinfo?.username);
	};

	items = handleSort(items, sort, sortDirection);

	const updateSort = () => (items = handleSort(items, sort, sortDirection));
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
					<TableCell columnId="id">
						<Label>Id</Label>
						<IconButton class="material-icons">arrow_upward</IconButton>
					</TableCell>
					<TableCell columnId="sender">
						<Label>From</Label>
						<IconButton class="material-icons">arrow_upward</IconButton>
					</TableCell>
					<TableCell columnId="content">
						<Label>Content</Label>
						<IconButton class="material-icons">arrow_upward</IconButton>
					</TableCell>
					<TableCell columnId="read">
						<Label>Read</Label>
						<IconButton class="material-icons">arrow_upward</IconButton>
					</TableCell>
				</Row>
			</Head>

			<Body>
				{#each slice as item}
					<Row>
						<TableCell>{item.id}</TableCell>
						<TableCell>{item.sender}</TableCell>
						<TableCell style="width: 100%;">{item.content}</TableCell>
						<TableCell>
							{#if item.read}
								<Icon class="material-icons green">check</Icon>
							{:else}
								<Icon class="material-icons red">close</Icon>
							{/if}
						</TableCell>
					</Row>
				{/each}
			</Body>

			<Pagination slot="paginate">
				<svelte:fragment slot="rowsPerPage">
					<Label>Rows per page:</Label>
					{#if javascriptOn}
						<Select variant="outlined" bind:value={rowsPerPage} noLabel>
							<Option value={10}>10</Option>
							<Option value={25}>25</Option>
							<Option value={100}>100</Option>
						</Select>
					{:else}
						<Label>10</Label>
					{/if}
				</svelte:fragment>

				<svelte:fragment slot="total">
					{start + 1}-{end} of {items.length}
				</svelte:fragment>

				<form method="POST" action="?/change_page" use:enhance={() => goto_page(0)}>
					<input type="hidden" name="page_no" value={0} />
					<IconButton
						class="material-icons"
						action="first-page"
						title="First page"
						disabled={currentPage === 0}>first_page</IconButton
					>
				</form>

				<form method="POST" action="?/change_page" use:enhance={prev_page}>
					<input type="hidden" name="page_no" value={currentPage - 1} />
					<IconButton
						class="material-icons"
						action="next-page"
						title="Next page"
						disabled={data.firstPage}>chevron_left</IconButton
					>
				</form>
				<form method="POST" action="?/change_page" use:enhance={next_page}>
					<input type="hidden" name="page_no" value={currentPage + 1} />
					<IconButton
						class="material-icons"
						action="next-page"
						title="Next page"
						disabled={data.lastPage}>chevron_right</IconButton
					>
				</form>

				<form
					method="POST"
					action="?/change_page"
					use:enhance={() => goto_page(data.lastPageNumber)}
				>
					<input type="hidden" name="page_no" value={data.lastPageNumber} />
					<IconButton
						class="material-icons"
						action="last-page"
						title="Last page"
						on:click={() => (data.pageNo = lastPage)}
						disabled={data.lastPage}>last_page</IconButton
					>
				</form>
			</Pagination>
		</DataTable>
	</Cell>
</LayoutGrid>

<style>
	:global(.mdc-text-field__icon.red) {
		color: red !important;
	}

	:global(.mdc-text-field__icon.green) {
		color: green !important;
	}
</style>
