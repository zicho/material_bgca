<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="container">
	<h1>Welcome {data.userinfo.username}</h1>
	<!-- <div class="mb-md mdc-typography--headline2">Welcome {data.userinfo?.username}!</div> -->
</div>
