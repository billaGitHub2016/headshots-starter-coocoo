// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const requestUrl = new URL(request.url);
    // const supabase = createRouteHandlerClient({ cookies });
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl as string, supabaseServiceRoleKey as string);

    await supabase.auth.signOut();
    cookies().delete('access_token');
    cookies().delete('refresh_token');

    return NextResponse.redirect(`${requestUrl.origin}/home`, {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
    });
}
