import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the webhook payload
    const payload = await request.json();
    
    console.log('Webhook received:', payload);

    // Get the client ID from the payload (assuming it's provided by the external service)
    const clientId = payload.clientId || payload.userId || payload.id;
    
    if (!clientId) {
      console.error('No client ID provided in webhook payload');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Client ID is required in webhook payload' 
        },
        { status: 400 }
      );
    }

    // Send message to specific client using global function
    const success = (global as any).sendToWebSocketClient(clientId, {
      type: 'webhook',
      data: payload,
      timestamp: new Date().toISOString()
    });

    if (!success) {
      console.error(`Failed to send message to client ${clientId}`);
      return NextResponse.json(
        { 
          success: false, 
          error: `Client ${clientId} not found or not connected` 
        },
        { status: 404 }
      );
    }

    console.log(`Message sent successfully to client ${clientId}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Message sent to client ${clientId}`,
      clientId 
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
