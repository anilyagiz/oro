import { NextRequest, NextResponse } from 'next/server';
import { serverGrailApi } from '@/lib/grail/server-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, keyType = 'PARTNER' } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'walletAddress is required' },
        { status: 400 }
      );
    }

    const challenge = await serverGrailApi.requestChallenge(walletAddress, keyType);
    return NextResponse.json({ success: true, data: challenge });
  } catch (error: any) {
    console.error('Request challenge failed:', error);
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || 'Failed to request challenge' },
      { status: error.response?.status || 500 }
    );
  }
}
