<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

<nav>
	<a href="/">Home</a>
	<a href="/dashboard">Dashboard</a>
	<a href="/login">Login</a>
	<a href="/register">Register</a>

	{#if $page.data.user}
		<form
			action="/logout"
			method="post"
			use:enhance
		>
			<button type="submit">Logout</button>
		</form>
	{/if}
</nav>

<main>
	<slot />
</main>
