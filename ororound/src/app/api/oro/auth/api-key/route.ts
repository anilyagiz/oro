import { NextRequest, NextResponse } from 'next/server';
import { serverGrailApi } from '@/lib/grail/server-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challengeId, signature, keyName, expirationDays } = body;

    if (!challengeId) {
      return NextResponse.json(
        { success: false, error: 'challengeId is required' },
        { status: 400 }
      );
    }

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'signature is required' },
        { status: 400 }
      );
    }

    if (!keyName) {
      return NextResponse.json(
        { success: false, error: 'keyName is required' },
        { status: 400 }
      );
    }

    const apiKey = await serverGrailApi.createApiKey(
      challengeId,
      signature,
      keyName,
      expirationDays
    );
    return NextResponse.json({ success: true, data: apiKey });
  } catch (error: any) {
    console.error('Create API key failed:', error);
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || 'Failed to create API key' },
      { status: error.response?.status || 500 }
    );
  }
}
