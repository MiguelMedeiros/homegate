import { Router, Request, Response } from 'express';
import { wsService } from '../services/websocket';

const router = Router();

// Webhook endpoint for phoenixd payment notifications
router.post('/', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    
    console.log('📬 Webhook received:', payload);

    // phoenixd sends payment notifications with externalId
    const { externalId, paymentHash, amountSat } = payload;

    if (!externalId) {
      console.error('No externalId in webhook payload');
      return res.status(400).json({
        success: false,
        error: 'externalId is required'
      });
    }

    // Send payment notification to the specific client
    const sent = wsService.sendToClient(externalId, {
      type: 'payment',
      status: 'paid',
      paymentHash,
      amountSat,
      externalId,
      message: 'Payment received successfully!'
    });

    if (sent) {
      console.log(`✅ Payment notification sent to client ${externalId}`);
      return res.json({
        success: true,
        message: `Notification sent to client ${externalId}`
      });
    } else {
      console.warn(`⚠️ Client ${externalId} not connected`);
      return res.status(404).json({
        success: false,
        error: `Client ${externalId} not connected`
      });
    }

  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process webhook'
    });
  }
});

export default router;

