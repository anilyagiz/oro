import { NextRequest, NextResponse } from 'next/server';
import { serverGrailApi } from '@/lib/grail/server-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, goldAmount, maxUsdcAmount, metadata } = body;

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

    if (!maxUsdcAmount || maxUsdcAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid maxUsdcAmount' },
        { status: 400 }
      );
    }

    const purchase = await serverGrailApi.purchaseGoldForUser(
      userId,
      goldAmount,
      maxUsdcAmount,
      metadata
    );

    return NextResponse.json({ success: true, data: purchase });
  } catch (error: any) {
    console.error('Purchase gold failed:', error);
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || 'Failed to purchase gold' },
      { status: error.response?.status || 500 }
    );
  }
}
