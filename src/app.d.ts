// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare namespace App {
	interface Locals {
		user: import('@supabase/supabase-js').User | null;
		userinfo: { username: string; } | null;
	}
	interface PageData {
		// user: import('@supabase/supabase-js').User | null;
		// userinfo: { username: string; } | null;
		session: import('@supabase/supabase-js').Session | null;
		user: import('@supabase/supabase-js').User | null;
		userinfo: { username: string; } | null;
		messageCount: number;
	}
	// interface Error {}
	// interface Platform {}
}
