import { NextRequest, NextResponse } from 'next/server';
import { serverGrailApi } from '@/lib/grail/server-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { txId, signedSerializedTx } = body;

    if (!txId) {
      return NextResponse.json(
        { success: false, error: 'txId is required' },
        { status: 400 }
      );
    }

    if (!signedSerializedTx) {
      return NextResponse.json(
        { success: false, error: 'signedSerializedTx is required' },
        { status: 400 }
      );
    }

    const result = await serverGrailApi.submitTransaction(txId, signedSerializedTx);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Submit transaction failed:', error);
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || 'Failed to submit transaction' },
      { status: error.response?.status || 500 }
    );
  }
}
