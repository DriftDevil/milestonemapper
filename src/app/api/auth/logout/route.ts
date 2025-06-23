
'use server';

import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    // To logout, we expire the cookie by setting maxAge to a negative number.
    // It's crucial to provide the same `path`, `secure`, and `sameSite` attributes
    // that were used when the cookie was set.
    response.cookies.set('session_token', '', {
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'none',
        maxAge: -1,
    });
    return response;
}
