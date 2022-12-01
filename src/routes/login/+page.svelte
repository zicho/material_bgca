<script lang="ts">
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import Button, { Label } from '@smui/button';
	import Card from '@smui/card';
	import { applyAction, enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { subscribeViaEmail } from '$lib/stores/messages';

	export let form: ActionData;

	function handleSubscriptions(data: {
		action: URL;
		data: FormData;
		form: HTMLFormElement;
		controller: AbortController;
		cancel(): void;
	}) {
		let email: string = data.data.get('email') as string;
		subscribeViaEmail(email);
	}
</script>

<svelte:head>
	<title>Login</title>
	<style>
		body {
			background: GhostWhite !important;
		}
	</style>
</svelte:head>

<div class="center-screen">
	<div class="card-display">
		<div class="card-container mdc-elevation--z2">
			<Card variant="outlined" padded>
				<div class="w-100">
					<div class="mb-md mdc-typography--headline6">Welcome. Please log in.</div>
				</div>
				<div>
					<!-- svelte-ignore missing-declaration -->
					<form
						method="POST"
						action="login"
						use:enhance={(data) => {
							return async ({ result }) => {
								if (result.type === 'redirect') {
									handleSubscriptions(data);
								}
								applyAction(result);
							};
						}}
					>
						<div class="mdc-typography--subtitle1 mr-auto">Email</div>
						<Textfield variant="outlined" class="mb-sm" required value={form?.email ?? ''} input$name="email">
							<Icon class="material-icons" slot="leadingIcon">mail</Icon>
						</Textfield>
						<div class="mdc-typography--subtitle1 mr-auto">Password</div>
						<Textfield
							variant="outlined"
							type="password"
							required
							value=""
							class="mb-md"
							input$name="password"
						>
							<Icon class="material-icons" slot="leadingIcon">key</Icon>
						</Textfield>
						<div class="w-100">
							<Button variant="unelevated">
								<Label>Login</Label>
							</Button>
						</div>
					</form>
				</div>

				<div class="my-md">
					<div
						class:hide={form?.message == undefined}
						class="color-error mdc-typography--subtitle1"
					>
						{form?.message}
					</div>
				</div>
				<div class="mdc-typography--subtitle1">
					<a href="/register">Wanna join? Register here.</a>
				</div>
			</Card>
		</div>
	</div>
</div>

<style lang="scss">
	@use 'src/theme/spacing';

	* :global(.smui-card--padded) {
		padding: var(--space-md) var(--space-xl);
	}
</style>
