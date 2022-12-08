<script lang="ts">
	import { unreadMessages } from '$lib/stores/messages';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="container">
	<div class="mb-xs mdc-typography--headline2">Welcome {data.userinfo.username}!</div>
	<div class="mb-md mdc-typography--body1">
		You have now logged in and your email is {data.user?.email}!
	</div>
	{#if $unreadMessages > 0 || data.messageCount > 0}
		<div class="mb-md mdc-typography--body1">
			You have unread messages!
		</div>
	{/if}
</div>
