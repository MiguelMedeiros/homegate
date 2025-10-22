import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://admin.homeserver.staging.pubky.app/generate_signup_token', {
      method: 'GET',
      headers: {
        'X-Admin-Password': 'voyage tuition cabin arm stock guitar soon salute',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch invite code: ${response.status} ${response.statusText}`);
    }

    // The homeserver returns a plain text token, not JSON
    console.log('Response headers:', response.headers.get('content-type'));
    const inviteCode = await response.text();
    console.log('Received invite code:', inviteCode);
    
    if (!inviteCode || inviteCode.trim().length === 0) {
      throw new Error('Empty invite code received');
    }
    
    return NextResponse.json({ 
      success: true, 
      inviteCode: inviteCode.trim()
    });
  } catch (error) {
    console.error('Error fetching invite code:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch invite code from homeserver' 
      },
      { status: 500 }
    );
  }
}
