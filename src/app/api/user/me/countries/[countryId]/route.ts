
'use server';

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { cookies } from 'next/headers';

const CONTEXT = "API User Country Management";
const EXTERNAL_API_URL = process.env.EXTERNAL_API_BASE_URL;

// POST handler to add a visited country
export async function POST(request: NextRequest, { params }: { params: { countryId: string } }) {
    if (!EXTERNAL_API_URL) {
        logger.error(CONTEXT, 'EXTERNAL_API_BASE_URL is not set.');
        return NextResponse.json({ message: 'API endpoint not configured.' }, { status: 500 });
    }

    const { countryId } = params;
    if (!countryId) {
        return NextResponse.json({ message: 'Country ID is required.' }, { status: 400 });
    }
    
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    
    const url = new URL(`/user/me/countries/${countryId}`, EXTERNAL_API_URL).toString();
    
    try {
        const body = await request.json().catch(() => ({}));
        
        const apiResponse = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            cache: 'no-store',
        });
        
        const responseText = await apiResponse.text();

        if (!responseText) {
            return new NextResponse(null, { status: apiResponse.status });
        }

        try {
            const data = JSON.parse(responseText);
            return NextResponse.json(data, { status: apiResponse.status });
        } catch (e) {
            logger.error(CONTEXT, 'Failed to parse JSON from backend on POST, returning as text.', { status: apiResponse.status, body: responseText });
            return new Response(responseText, { status: apiResponse.status });
        }

    } catch (error: any) {
        logger.error(CONTEXT, `Error forwarding POST request to ${url}:`, error.message);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}


// DELETE handler to remove a visited country
export async function DELETE(request: NextRequest, { params }: { params: { countryId: string } }) {
    if (!EXTERNAL_API_URL) {
        logger.error(CONTEXT, 'EXTERNAL_API_BASE_URL is not set.');
        return NextResponse.json({ message: 'API endpoint not configured.' }, { status: 500 });
    }

    const { countryId } = params;
    if (!countryId) {
        return NextResponse.json({ message: 'Country ID is required.' }, { status: 400 });
    }
    
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
    };
    
    const url = new URL(`/user/me/countries/${countryId}`, EXTERNAL_API_URL).toString();
    
    try {
        const apiResponse = await fetch(url, {
            method: 'DELETE',
            headers,
            cache: 'no-store',
        });
        
        const responseText = await apiResponse.text();

        if (!responseText) {
            return new NextResponse(null, { status: apiResponse.status });
        }
        
        try {
            const data = JSON.parse(responseText);
            return NextResponse.json(data, { status: apiResponse.status });
        } catch (e) {
            logger.error(CONTEXT, 'Failed to parse JSON from backend on DELETE, returning as text.', { status: apiResponse.status, body: responseText });
            return new Response(responseText, { status: apiResponse.status });
        }

    } catch (error: any) {
        logger.error(CONTEXT, `Error forwarding DELETE request to ${url}:`, error.message);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
