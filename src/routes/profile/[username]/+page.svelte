<script lang="ts">
	import type { PageData } from './$types';
	import Fab, { Icon } from '@smui/fab';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import { enhance } from '$app/forms';
	export let data: PageData;
</script>

<svelte:head>
	<title>{data.username}'s profile</title>
</svelte:head>

<LayoutGrid>
	<Cell spanDevices={{ desktop: 3, tablet: 2, phone: 1 }}>
		<form method="post" use:enhance enctype="multipart/form-data">
			<div class="avatar-container">
				<img id="avatar" src={data.avatarUrl} alt="avatar" />
				{#if data.isYourPage}
					<input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />
					<button class="upload-btn">Upload</button>
				{/if}
			</div>
		</form>
	</Cell>
	<Cell spanDevices={{ desktop: 6, tablet: 4, phone: 2 }}>
		<div class="mb-xxs mdc-typography--headline2">
			{data.isYourPage ? 'Your profile' : `Profile of ${data.slug}`}
		</div>
	</Cell>

	<Cell spanDevices={{ desktop: 3, tablet: 2, phone: 1 }}>
		{#if data.isYourPage}
			<Fab href="/profile/{data.username}/edit" color="primary" style="float: right">
				<Icon class="material-icons">edit</Icon>
			</Fab>
		{:else}
			<Fab href="/message/{data.slug}" color="primary" style="float: right">
				<Icon class="material-icons">mail</Icon>
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

<style>
	.avatar-container {
		display: flex;
		flex-direction: column;
	}

	#avatar {
		height: 128px;
		width: 128px;
		margin-bottom: 10px;
	}

	.hidden {
		display: none;
	}

	.upload-btn {
		width: 128px;
		height: 32px;
		background-color: black;
		font-family: sans-serif;
		color: white;
		font-weight: bold;
		border: none;
	}

	.upload-btn:hover {
		background-color: white;
		color: black;
		outline: black solid 2px;
	}
</style>
