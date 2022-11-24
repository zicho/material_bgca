<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Start Page</title>
</svelte:head>

<div class="container">
	<div class="mb-md mdc-typography--headline2">Welcome {data.userinfo?.username}!</div>
</div>
