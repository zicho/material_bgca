<script lang="ts">
	import { page } from '$app/stores';
	import Fab, { Icon } from '@smui/fab';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<LayoutGrid>
	<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 2 }}>
		<div class="mb-xxs mdc-typography--headline2">{$page.data.isYourPage ? 'Your profile' : `Profile of ${$page.data.slug}`}</div>
	</Cell>

	<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 2 }}>
		{#if $page.data.isYourPage}
			<Fab href="/profile/{$page.data.profile?.username}/edit" color="primary" style="float: right">
				<Icon class="material-icons">edit</Icon>
			</Fab>
		{/if}
	</Cell>

	<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 2 }}>
		<div class="mb-xxs mdc-typography--headline5">About</div>
		<div class="mdc-typography--body1">
			{#if $page.data.profileInfo?.description}
				{$page.data.profileInfo?.description}
			{:else}
				<i>This user has not written a profile text.</i>
			{/if}
		</div>
	</Cell>
</LayoutGrid>
