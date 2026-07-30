import { NextResponse } from 'next/server';

// Mock in-memory database for testing until Supabase is connected
const mockVotes = {
  apple: 18293,
  android: 11706,
};

export async function POST(request: Request) {
  try {
    const { option, fingerprint } = await request.json();

    if (!option || !fingerprint) {
      return NextResponse.json({ error: 'Missing option or fingerprint' }, { status: 400 });
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Anti-cheat check (mock)
    // if (hasVoted(fingerprint)) return error('Already voted')

    if (option === 'apple') mockVotes.apple += 1;
    if (option === 'android') mockVotes.android += 1;

    const total = mockVotes.apple + mockVotes.android;
    const rank = Math.floor(Math.random() * 1000) + 18000;

    return NextResponse.json({
      success: true,
      rank,
      results: {
        apple: mockVotes.apple,
        android: mockVotes.android,
        applePercent: Math.round((mockVotes.apple / total) * 100),
        androidPercent: Math.round((mockVotes.android / total) * 100),
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process vote' }, { status: 500 });
  }
}

export async function GET() {
  const total = mockVotes.apple + mockVotes.android;
  return NextResponse.json({
    apple: mockVotes.apple,
    android: mockVotes.android,
    applePercent: Math.round((mockVotes.apple / total) * 100),
    androidPercent: Math.round((mockVotes.android / total) * 100),
  });
}
