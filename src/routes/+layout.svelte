<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import { Icon } from '@smui/icon-button';
	import Button, { Label } from '@smui/button';
	import type { PageData } from './$types';
	import { subscribeToMessages, unreadMessages } from '$lib/stores/messages';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { unsubscribeAll } from '$lib/stores/unsubscribe';

	export let data: PageData;

	onMount(async () => {
		// if we find a user in session, hookup all subscriptions (otherwise this gets handled by login hook)
		if (data.userinfo?.username) {
			await subscribeToMessages(data.userinfo?.username as string);
		}
	});

	let unreadMessageCount = data.messageCount;

	if (browser) {
		unreadMessages.subscribe((value) => {
			unreadMessageCount = value;
		});
	}
</script>

<main>
	<div class="flexy">
		<div class="top-app-bar-container">
			<TopAppBar variant="static">
				<Row>
					<Section>
						<Button href="/">
							<Title>BGCA</Title>
						</Button>
					</Section>
					<Section align="end" toolbar>
						{#if data.user}
							<Button href="/">
								<Icon class="material-icons">home</Icon>
								<Label>Home</Label>
							</Button>

							<Button href="/dashboard">
								<Icon class="material-icons">dashboard</Icon>
								<Label>Dashboard</Label>
							</Button>

							<Button>
								<Icon class="material-icons">notifications</Icon>
								<Label>0</Label>
							</Button>
							<Button href="/inbox">
								<Icon class="material-icons">mail</Icon>
								<Label>{unreadMessageCount}</Label>
							</Button>

							<Label class="mb-xxs">|</Label>

							<Button href="/profile/{data.userinfo?.username}">
								<Icon class="material-icons">person</Icon>
								<Label>{data.userinfo?.username}</Label>
							</Button>

							<form
								action="/logout"
								method="post"
								use:enhance={() => {
									return async ({ result }) => {
										if (result.type === 'redirect') {
											await unsubscribeAll();
										}
										applyAction(result);
									};
								}}
							>
								<Button>
									<Icon class="material-icons">logout</Icon>
									<Label>Log out</Label>
								</Button>
							</form>
						{:else}
							<Button href="/login">
								<Icon class="material-icons">login</Icon>
								<Label>Login</Label>
							</Button>
							<Button href="/register">
								<Icon class="material-icons">app_registration</Icon>
								<Label>Register</Label>
							</Button>
						{/if}
					</Section>
				</Row>
			</TopAppBar>
			<div>
				<slot />
			</div>
		</div>
	</div>
</main>
