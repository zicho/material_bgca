<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import { Icon } from '@smui/icon-button';
	import Button, { Label } from '@smui/button';
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
						{#if $page.data.user}
							<Button href="/">
								<Icon class="material-icons">home</Icon>
								<Label>Home</Label>
							</Button>

							<Button href="/dashboard">
								<Icon class="material-icons">dashboard</Icon>
								<Label>Dashboard</Label>
							</Button>

							<Label class="mb-xxs">|</Label>

							<Button href="/profile/{$page.data.profile?.username}">
								<Icon class="material-icons">alternate_email</Icon>
								<Label>{$page.data.profile?.username}</Label>
							</Button>

							<form action="/logout" method="post" use:enhance>
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
