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

	export let data: PageData;

	let items: IMessage[] = data.messages;
	let rowsPerPage = 10;
	let currentPage = 0;

	$: start = currentPage * rowsPerPage;
	$: end = Math.min(start + rowsPerPage, items.length);
	$: slice = items.slice(start, end);
	$: lastPage = Math.max(Math.ceil(items.length / rowsPerPage) - 1, 0);

	$: if (currentPage > lastPage) {
		currentPage = lastPage;
	}

	let sort: keyof IMessage = 'sender';
	let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';

	function handleSort() {
		items.sort((a, b) => {
			const [aVal, bVal] = [a[sort], b[sort]][
				sortDirection === 'ascending' ? 'slice' : 'reverse'
			]();
			if (typeof aVal === 'string' && typeof bVal === 'string') {
				return aVal.localeCompare(bVal);
			}
			return Number(aVal) - Number(bVal);
		});
		items = items;
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
			on:SMUIDataTable:sorted={handleSort}
			table$aria-label="User list"
			style="width: 100%;"
		>
			<Head>
				<Row>
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
						<TableCell>{item.sender}</TableCell>
						<TableCell style="width: 100%;">{item.content}</TableCell>
						<TableCell
							><Icon class="material-icons">{item.read ? 'check' : 'close'}</Icon></TableCell
						>
					</Row>
				{/each}
			</Body>

			<Pagination slot="paginate">
				<svelte:fragment slot="rowsPerPage">
					<Label>Rows Per Page</Label>
					<Select variant="outlined" bind:value={rowsPerPage} noLabel>
						<Option value={10}>10</Option>
						<Option value={25}>25</Option>
						<Option value={100}>100</Option>
					</Select>
				</svelte:fragment>
				<svelte:fragment slot="total">
					{start + 1}-{end} of {items.length}
				</svelte:fragment>

				<IconButton
					class="material-icons"
					action="first-page"
					title="First page"
					on:click={() => (currentPage = 0)}
					disabled={currentPage === 0}>first_page</IconButton
				>
				<IconButton
					class="material-icons"
					action="prev-page"
					title="Prev page"
					on:click={() => currentPage--}
					disabled={currentPage === 0}>chevron_left</IconButton
				>
				<IconButton
					class="material-icons"
					action="next-page"
					title="Next page"
					on:click={() => currentPage++}
					disabled={currentPage === lastPage}>chevron_right</IconButton
				>
				<IconButton
					class="material-icons"
					action="last-page"
					title="Last page"
					on:click={() => (currentPage = lastPage)}
					disabled={currentPage === lastPage}>last_page</IconButton
				>
			</Pagination>
		</DataTable>
	</Cell>
</LayoutGrid>
