
'use server';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    // To logout, we expire the cookie by setting maxAge to a negative number.
    cookies().set('session_token', '', {
        httpOnly: true,
        path: '/',
        maxAge: -1,
    });
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
