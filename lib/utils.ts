import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createClient } from '@supabase/supabase-js';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder('utf-8');
    let result = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }
        result += decoder.decode(value);
    }

    reader.releaseLock();
    return result;
}

export function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl as string, supabaseServiceRoleKey as string);
    return supabase;
}
