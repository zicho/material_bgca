import { createClient, getSupabase } from '@supabase/auth-helpers-sveltekit';
import { env } from '$env/dynamic/public';
import {} from '@supabase/auth-helpers-sveltekit';
import type { RequestEvent } from '.svelte-kit/types/src/routes/(auth)/$types';
const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);

export default supabase;


