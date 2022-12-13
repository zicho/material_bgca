<script lang="ts">	
	import { unreadMessages } from '$lib/stores/messages';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="container">
	<div class="mb-lg">
		<div class="mb-xs mdc-typography--headline2">Welcome {data.userinfo.username}!</div>
		<div class="mb-md mdc-typography--body1">
			You have now logged in and your email is {data.user?.email}!
		</div>
		{#if $unreadMessages > 0 || data.messageCount > 0}
			<div class="mb-md mdc-typography--body1">You have unread messages! <a href="/inbox">Click here to go to your inbox.</a></div> 
		{/if}
	</div>
	<div class="mb-xs mdc-typography--headline3">Registered users:</div>
	{#each data.userList as user}
		<div class="mb-md mdc-typography--body1">
			<a href="/profile/{user}">{user}</a>
		</div>
	{/each}
</div>
