<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { Label } from '@smui/button';
	import Button from '@smui/button/src/Button.svelte';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Textfield from '@smui/textfield';

	/** @type {import('./$types').PageData} */
	export let data: PageData;
</script>

<svelte:head>
	<title>Edit profile</title>
</svelte:head>

<LayoutGrid>
	<Cell spanDevices={{ desktop: 12, tablet: 8, phone: 4 }}>
		<div class="mb-xxs mdc-typography--headline2">Send message to {data.slug}</div>
	</Cell>

	<Cell spanDevices={{ desktop: 6, tablet: 8, phone: 4 }}>
		<form class="w-100" method="POST" use:enhance>
			<Textfield
				textarea
				value=''
				input$name="content"
				input$rows={8}
				input$cols={48}
				input$resizable={false}
			/>
			<Button class="mt-md" variant="unelevated">
				<Label>Send</Label>
			</Button>
		</form>
	</Cell>
</LayoutGrid>
