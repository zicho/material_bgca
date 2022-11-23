<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { redirect } from '@sveltejs/kit';
	import public_routes from '../lib/data/public_routes.json';

	// Route protection
	// If user is unauthenticated and trying to access a page _not_ within public, redirect to login
	if (!$page.data.user && !public_routes.includes($page.url.pathname)) {
		throw redirect(302, '/login');
	}
	// If user _is_ authenticated and trying to access a page _within_ public, redirect to homepage...
	else if ($page.data.user && public_routes.includes($page.url.pathname)) {
		// ...but avoid circular redirects :)
		if ($page.url.pathname != '/') {
			throw redirect(302, '/');
		}
	}
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
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'redirect') {
						goto('/');
					} else if (result.type === 'invalid') {
						applyAction(result);
					}
				};
			}}
		>
			<button type="submit">Logout</button>
		</form>
		
	
	{/if}
</nav>

<main>
	<slot />
</main>
