<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<div class="container">
	<div class="mb-md mdc-typography--headline2">Profile of {$page.data.slug}</div>
</div>
