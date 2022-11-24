// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare namespace App {
	interface Locals {
		user: import('@supabase/supabase-js').User | null;
		profile: { username: string; description: string } | null;
	}
	interface PageData {
		user: import('@supabase/supabase-js').User | null;
		profile: { username: string; description: string } | null;
	}
	// interface Error {}
	// interface Platform {}
}
