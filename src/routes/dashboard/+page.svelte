<script lang="ts">
	import Button, { Label } from '@smui/button';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<!-- svelte-ignore missing-declaration -->
<LayoutGrid>
	<Cell spanDevices={{ desktop: 4, tablet: 4, phone: 2 }}>
		<Button class="mt-md" variant="unelevated">
			<Label>Add game</Label>
		</Button>

		<Button class="mt-md" variant="unelevated">
			<Label>Create event</Label>
		</Button>
	</Cell>
</LayoutGrid>
