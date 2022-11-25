<script lang="ts">
	import { subscribeToMessages } from '$lib/stores/messages';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	onMount(async () => {
		console.dir(data.userinfo?.username)
		await subscribeToMessages(data.userinfo?.username as string);
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="container">
	<div class="mb-md mdc-typography--headline2">Welcome {data.userinfo?.username}!</div>
</div>
