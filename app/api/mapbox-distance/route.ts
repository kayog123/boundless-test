import { NextRequest, NextResponse } from 'next/server';
import { calculateDistance } from '@/services/mapbox/actions';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');

  if (!origin || !destination) {
    return NextResponse.json(
      { error: 'origin and destination mapbox IDs are required' },
      { status: 400 }
    );
  }

  try {
    const result = await calculateDistance(origin, destination);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to calculate distance' },
      { status: 500 }
    );
  }
}
