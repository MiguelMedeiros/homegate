import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the webhook payload
    const payload = await request.json();
    
    console.log('Webhook received:', payload);

    // TODO: Process webhook payload
    // This endpoint will be implemented when we add webhook functionality
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process webhook' 
      },
      { status: 500 }
    );
  }
}
