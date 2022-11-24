<script>
	import { page } from '$app/stores';
</script>

<div class="container">
	<div class="mb-md mdc-typography--headline2">{$page.status}: {$page.error?.message}</div>
</div>
