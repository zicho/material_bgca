<script lang="ts">
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import Button, { Label } from '@smui/button';
	import Card from '@smui/card';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Register</title>
	<style>
		body {
			background: GhostWhite !important;
		}
	</style>
</svelte:head>

<div class="center-screen mx-auto">
	<div class="card-display">
		<div class="card-container mdc-elevation--z2">
			<Card variant="outlined" padded>
				<div class="w-100">
					<div class="mb-md mdc-typography--headline6">Register new user.</div>
				</div>
				<div>
					<!-- svelte-ignore missing-declaration -->
					<form method="POST" action="register" use:enhance>
						<div class="mdc-typography--subtitle1 mr-auto">Username</div>
						<Textfield
							variant="outlined"
							type="text"
							required
							value={form?.username ?? ''}
							class="mb-sm"
							input$name="username"
						>
							<Icon class="material-icons" slot="leadingIcon">person</Icon>
						</Textfield>

						<div class="mdc-typography--subtitle1 mr-auto">Email</div>
						<Textfield
							variant="outlined"
							type="email"
							required
							value={form?.email ?? ''}
							class="mb-sm"
							input$name="email"
						>
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

						<div class="mdc-typography--subtitle1 mr-auto">Confirm password</div>
						<Textfield
							variant="outlined"
							type="password"
							required
							value=""
							class="mb-md"
							input$name="password_confirm"
						>
							<Icon class="material-icons" slot="leadingIcon">check</Icon>
						</Textfield>

						<div class="w-100">
							<Button variant="unelevated">
								<Label>Register</Label>
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
				<div class="mdc-typography--subtitle1"><a href="/login">Already a member? Login.</a></div>
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
