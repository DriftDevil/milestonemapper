
'use server';

import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    // To logout, we expire the cookie by setting maxAge to a negative number.
    response.cookies.set('session_token', '', {
        httpOnly: true,
        path: '/',
        maxAge: -1,
    });
    return response;
}
