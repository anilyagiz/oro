import { NextRequest, NextResponse } from 'next/server';
import { serverGrailApi } from '@/lib/grail/server-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = await serverGrailApi.getUser(userId);
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error('Get user failed:', error);
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || 'Failed to get user' },
      { status: error.response?.status || 500 }
    );
  }
}
