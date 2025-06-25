
'use server';

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { cookies } from 'next/headers';

const CONTEXT = "API User Parks";
const EXTERNAL_API_URL = process.env.EXTERNAL_API_BASE_URL;

// GET handler to fetch visited parks
export async function GET(request: NextRequest) {
    if (!EXTERNAL_API_URL) {
        logger.error(CONTEXT, 'EXTERNAL_API_BASE_URL is not set.');
        return NextResponse.json({ message: 'API endpoint not configured.' }, { status: 500 });
    }

    const cookieStore = cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL('/user/me/parks', EXTERNAL_API_URL).toString();
    
    try {
        const apiResponse = await fetch(url, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            cache: 'no-store',
        });
        
        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return NextResponse.json(data, { status: apiResponse.status });
        }
        return NextResponse.json(data);

    } catch (error: any) {
        logger.error(CONTEXT, `Error forwarding GET request to ${url}:`, error.message);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}

// DELETE handler to remove all visited parks for a user
export async function DELETE(request: NextRequest) {
    if (!EXTERNAL_API_URL) {
        logger.error(CONTEXT, 'EXTERNAL_API_BASE_URL is not set.');
        return NextResponse.json({ message: 'API endpoint not configured.' }, { status: 500 });
    }

    const cookieStore = cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
    };

    const url = new URL(`/user/me/parks`, EXTERNAL_API_URL).toString();

    try {
        const apiResponse = await fetch(url, {
            method: 'DELETE',
            headers,
            cache: 'no-store',
        });

        if (apiResponse.status === 204 || apiResponse.status === 200) {
           return new NextResponse(null, { status: 204 });
        }

        const data = await apiResponse.json();
        return NextResponse.json(data, { status: apiResponse.status });

    } catch (error: any) {
        logger.error(CONTEXT, `Error forwarding bulk DELETE request to ${url}:`, error.message);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
