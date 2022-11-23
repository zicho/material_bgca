<script lang="ts">
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import HelperText from '@smui/textfield/helper-text';
	import Button, { Label } from '@smui/button';
	import Card from '@smui/card';

	let username: string = '';
	let password: string = '';

	let error: boolean = true;
</script>

<svelte:head>
	<title>Login</title>
	<style>
		body {
			background: GhostWhite !important;
		}
	</style>
</svelte:head>

<div class="login center-screen mx-auto">
	<div class="card-display">
		<div class="card-container mdc-elevation--z2">
			<Card variant="outlined" padded>
				<div class="w-100">
					<div class="mb-md mdc-typography--headline6">Welcome. Please log in.</div>
				</div>
				<div>
					<form method="POST" action="login">
						<div class="mdc-typography--subtitle1 mr-auto">Username</div>
						<Textfield variant="outlined" bind:value={username} class="mb-sm" input$name="username">
							<Icon class="material-icons" slot="leadingIcon">account_circle</Icon>
						</Textfield>
						<div class="mdc-typography--subtitle1 mr-auto">Password</div>
						<Textfield variant="outlined" type="password" bind:value={password} class="mb-md" input$name="password">
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
					<div class:hide={!error} class="color-error mdc-typography--subtitle1">Error!</div>
				</div>
				<div class="mdc-typography--subtitle1"><a href="/">Click here to register</a></div>
			</Card>
		</div>
	</div>
</div>

<style lang="scss">
	@use '../../theme/spacing';

	.login {
		flex-direction: column;
		width: fit-content;
	}

	* :global(.smui-card--padded) {
		padding: var(--space-md) var(--space-xl);
	}
</style>
