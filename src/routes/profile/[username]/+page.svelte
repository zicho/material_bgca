<script lang="ts">
	import type { PageData } from './$types';
	import Fab, { Icon } from '@smui/fab';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	export let data: PageData;
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<LayoutGrid>
	<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 2 }}>
		<div class="mb-xxs mdc-typography--headline2">
			{data.isYourPage ? 'Your profile' : `Profile of ${data.username}`}
		</div>
	</Cell>

	<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 2 }}>
		{#if data.isYourPage}
			<Fab href="/profile/{data.username}/edit" color="primary" style="float: right">
				<Icon class="material-icons">edit</Icon>
			</Fab>
		{/if}
	</Cell>

	<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 2 }}>
		<div class="mb-xxs mdc-typography--headline5">About</div>
		<div class="mdc-typography--body1">
			{#if data.profile?.description}
				{data.profile?.description}
			{:else}
				<i>This user has not written a profile text.</i>
			{/if}
		</div>
	</Cell>
</LayoutGrid>
