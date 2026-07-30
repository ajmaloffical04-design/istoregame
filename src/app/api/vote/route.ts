import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const CAMPAIGN_ID = '11111111-1111-1111-1111-111111111111';
const APPLE_ID = '22222222-2222-2222-2222-222222222222';
const ANDROID_ID = '33333333-3333-3333-3333-333333333333';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { option } = body;
    
    if (!option || !['apple', 'android'].includes(option)) {
      return NextResponse.json({ error: 'Invalid option' }, { status: 400 });
    }

    const cookieStore = await cookies();
    let sessionId = cookieStore.get('session_id')?.value;
    
    // Check if user has already voted
    if (sessionId) {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('campaign_id', CAMPAIGN_ID)
        .eq('user_id', sessionId)
        .single();
        
      if (existingVote) {
        return NextResponse.json({ error: 'Already voted' }, { status: 403 });
      }
    } else {
      sessionId = uuidv4();
    }

    const optionId = option === 'apple' ? APPLE_ID : ANDROID_ID;

    // Insert vote
    const { error: insertError } = await supabase
      .from('votes')
      .insert({
        campaign_id: CAMPAIGN_ID,
        option_id: optionId,
        user_id: sessionId
      });

    if (insertError) {
      if (insertError.code === '23505') { // Unique constraint violation
        return NextResponse.json({ error: 'Already voted' }, { status: 403 });
      }
      console.error(insertError);
      return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
    }

    // Return success and set cookie if it was newly generated
    const response = NextResponse.json({ success: true });
    
    if (!cookieStore.get('session_id')) {
      response.cookies.set('session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  } catch (error) {
    console.error('Vote Error:', error);
    return NextResponse.json({ error: 'Failed to process vote' }, { status: 500 });
  }
}

export async function GET() {
  const { count: appleCount } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('option_id', APPLE_ID);
    
  const { count: androidCount } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('option_id', ANDROID_ID);

  const apple = appleCount || 0;
  const android = androidCount || 0;
  const total = apple + android;

  const applePercent = total > 0 ? Math.round((apple / total) * 100) : 50;
  const androidPercent = total > 0 ? Math.round((android / total) * 100) : 50;

  return NextResponse.json({
    apple,
    android,
    applePercent,
    androidPercent,
  });
}
