<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Label } from '@smui/button';
	import Button from '@smui/button/src/Button.svelte';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Textfield from '@smui/textfield';

	let profileText = $page.data.profileInfo.description;
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<LayoutGrid>
	<Cell spanDevices={{ desktop: 12, tablet: 8, phone: 4 }}>
		<div class="mb-xxs mdc-typography--headline2">Edit profile: {$page.data.slug}</div>
	</Cell>

	<Cell spanDevices={{ desktop: 12, tablet: 8, phone: 4 }}>
		<form style="display: flex; flex-direction: column; width: fit-content"
		method="POST"
		use:enhance>
			<Textfield
				textarea
				bind:value={profileText}
				input$name="description"
				input$rows={8}
				input$cols={48}
				input$resizable={false}
			/>
			<Button class="mt-md" variant="unelevated">
				<Label>Save</Label>
			</Button>
		</form>
	</Cell>
</LayoutGrid>
