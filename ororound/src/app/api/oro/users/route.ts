import { NextRequest, NextResponse } from 'next/server';
import { serverGrailApi } from '@/lib/grail/server-client';
import { isServerEnvValid } from '@/lib/env.server';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!isServerEnvValid()) {
      console.error('GRAIL_API_KEY is not configured in environment variables');
      return NextResponse.json(
        { success: false, error: 'API not configured. Please set GRAIL_API_KEY in Vercel.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { kycHash, userWalletAddress, metadata } = body;

    if (!kycHash) {
      return NextResponse.json(
        { success: false, error: 'kycHash is required' },
        { status: 400 }
      );
    }

    console.log('Creating user with wallet:', userWalletAddress?.slice(0, 8) + '...');
    
    const user = await serverGrailApi.createUser(kycHash, userWalletAddress, metadata);
    
    console.log('User created successfully:', user.userId);
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || 'Failed to create user';
    const statusCode = error.response?.status || 500;
    
    console.error('Create user failed:', {
      status: statusCode,
      error: errorMessage,
      details: error.response?.data,
    });
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const users = await serverGrailApi.listUsers(page, limit);
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('List users failed:', error);
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || 'Failed to list users' },
      { status: error.response?.status || 500 }
    );
  }
}
