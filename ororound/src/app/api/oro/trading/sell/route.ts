import { NextRequest, NextResponse } from 'next/server';
import { serverGrailApi } from '@/lib/grail/server-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, goldAmount, minimumUsdcAmount, metadata } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!goldAmount || goldAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid goldAmount' },
        { status: 400 }
      );
    }

    if (!minimumUsdcAmount || minimumUsdcAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid minimumUsdcAmount' },
        { status: 400 }
      );
    }

    const sellData = await serverGrailApi.sellGoldForUser(
      userId,
      goldAmount,
      minimumUsdcAmount,
      metadata
    );

    return NextResponse.json({ success: true, data: sellData });
  } catch (error: any) {
    console.error('Sell gold failed:', error);
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || 'Failed to sell gold' },
      { status: error.response?.status || 500 }
    );
  }
}
