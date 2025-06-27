
'use server';

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { cookies } from 'next/headers';

const CONTEXT = "API User State Management";
const EXTERNAL_API_URL = process.env.EXTERNAL_API_BASE_URL;

const getAuthHeaders = () => {
    const cookieStore = cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
        return { error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }), headers: null };
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
    };
    
    return { error: null, headers };
};

// POST handler to add a visited state
export async function POST(request: NextRequest, { params }: { params: { stateId: string } }) {
    if (!EXTERNAL_API_URL) {
        logger.error(CONTEXT, 'EXTERNAL_API_BASE_URL is not set.');
        return NextResponse.json({ message: 'API endpoint not configured.' }, { status: 500 });
    }

    const { stateId } = params;
    if (!stateId) {
        return NextResponse.json({ message: 'State ID is required.' }, { status: 400 });
    }
    
    const { error, headers } = getAuthHeaders();
    if (error) return error;

    const url = new URL(`/user/me/states/${stateId}`, EXTERNAL_API_URL).toString();
    
    try {
        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: headers!,
            body: null,
            cache: 'no-store',
        });
        
        const responseText = await apiResponse.text();
        if (!responseText) return new NextResponse(null, { status: apiResponse.status });

        try {
            return NextResponse.json(JSON.parse(responseText), { status: apiResponse.status });
        } catch (e) {
            return new Response(responseText, { status: apiResponse.status });
        }
    } catch (error: any) {
        logger.error(CONTEXT, `Error forwarding POST request to ${url}:`, error.message);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}

// DELETE handler to remove a visited state
export async function DELETE(request: NextRequest, { params }: { params: { stateId: string } }) {
    if (!EXTERNAL_API_URL) {
        logger.error(CONTEXT, 'EXTERNAL_API_BASE_URL is not set.');
        return NextResponse.json({ message: 'API endpoint not configured.' }, { status: 500 });
    }

    const { stateId } = params;
    if (!stateId) {
        return NextResponse.json({ message: 'State ID is required.' }, { status: 400 });
    }
    
    const { error, headers } = getAuthHeaders();
    if (error) return error;
    
    const url = new URL(`/user/me/states/${stateId}`, EXTERNAL_API_URL).toString();
    
    try {
        const apiResponse = await fetch(url, {
            method: 'DELETE',
            headers: headers!,
            cache: 'no-store',
        });
        
        const responseText = await apiResponse.text();
        if (!responseText) return new NextResponse(null, { status: apiResponse.status });
        
        try {
            return NextResponse.json(JSON.parse(responseText), { status: apiResponse.status });
        } catch (e) {
            return new Response(responseText, { status: apiResponse.status });
        }
    } catch (error: any) {
        logger.error(CONTEXT, `Error forwarding DELETE request to ${url}:`, error.message);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
