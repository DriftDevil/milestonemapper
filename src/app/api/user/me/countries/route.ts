'use server';

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { cookies } from 'next/headers';

const CONTEXT = "API User Countries";
const EXTERNAL_API_URL = process.env.EXTERNAL_API_BASE_URL;

// GET handler to fetch visited countries
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
    
    const url = `${EXTERNAL_API_URL}/user/me/countries`;
    
    try {
        const apiResponse = await fetch(url, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
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

// POST handler to add a visited country
export async function POST(request: NextRequest) {
    if (!EXTERNAL_API_URL) {
        logger.error(CONTEXT, 'EXTERNAL_API_BASE_URL is not set.');
        return NextResponse.json({ message: 'API endpoint not configured.' }, { status: 500 });
    }

    const cookieStore = cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const url = `${EXTERNAL_API_URL}/user/me/countries`;
    
    try {
        const body = await request.json();
        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await apiResponse.json();
        
        if (!apiResponse.ok) {
            return NextResponse.json(data, { status: apiResponse.status });
        }
        return NextResponse.json(data, { status: 201 });

    } catch (error: any) {
        logger.error(CONTEXT, `Error forwarding POST request to ${url}:`, error.message);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
