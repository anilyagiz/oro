import { NextRequest, NextResponse } from 'next/server';
import { serverGrailApi } from '@/lib/grail/server-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kycHash, userWalletAddress, metadata } = body;

    if (!kycHash) {
      return NextResponse.json(
        { success: false, error: 'kycHash is required' },
        { status: 400 }
      );
    }

    const user = await serverGrailApi.createUser(kycHash, userWalletAddress, metadata);
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error('Create user failed:', error);
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || 'Failed to create user' },
      { status: error.response?.status || 500 }
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
