import { Request, Response } from 'express';

// Phoenix server configuration
const PHOENIXD_HOST = process.env.PHOENIXD_HOST || 'http://127.0.0.1:9740';
const PHOENIXD_TOKEN = process.env.PHOENIXD_TOKEN || '';

interface CreateInvoiceBody {
  amountSat?: number;
  description?: string;
  externalId: string;
  expirySeconds?: number;
  webhookUrl?: string;
}

interface PhoenixdInvoiceResponse {
  serialized: string;
  amountSat: number;
  paymentHash: string;
}

export async function createInvoice(req: Request, res: Response): Promise<void> {
  try {
    const {
      amountSat = 100,
      description = 'Homeserver Signup - Basic Plan',
      externalId,
      expirySeconds = 3600, // 1 hour default
      webhookUrl = 'http://backend:8881/api/webhook',
    }: CreateInvoiceBody = req.body;


    console.log(webhookUrl);
    // Validate required fields
    if (!externalId) {
      res.status(400).json({ error: 'externalId is required' });
      return;
    }

    // Validate phoenixd token
    if (!PHOENIXD_TOKEN) {
      res.status(500).json({ error: 'PHOENIXD_TOKEN not configured' });
      return;
    }

    // Create form data for phoenixd API
    const formData = new URLSearchParams();
    formData.append('description', description);
    if (amountSat) {
      formData.append('amountSat', amountSat.toString());
    }
    formData.append('externalId', externalId);
    formData.append('expirySeconds', expirySeconds.toString());
    formData.append('webhookUrl', webhookUrl);

    // Call phoenixd API
    const phoenixdResponse = await fetch(`${PHOENIXD_HOST}/createinvoice`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`:${PHOENIXD_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!phoenixdResponse.ok) {
      const errorText = await phoenixdResponse.text();
      console.error('Phoenixd API error:', errorText);
      throw new Error(`Phoenixd API error: ${phoenixdResponse.status} ${errorText}`);
    }

    const phoenixdData = await phoenixdResponse.json() as PhoenixdInvoiceResponse;

    res.json({
      success: true,
      invoice: phoenixdData.serialized,
      amountSat: phoenixdData.amountSat,
      paymentHash: phoenixdData.paymentHash,
      externalId,
      description,
      webhookUrl,
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    
    res.status(500).json({ 
      error: 'Failed to create invoice',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function getInvoiceStatus(req: Request, res: Response): Promise<void> {
  try {
    const paymentHash = req.query.paymentHash as string;

    if (!paymentHash) {
      res.status(400).json({ error: 'paymentHash is required' });
      return;
    }

    // TODO: Implement status check using phoenixd API
    // For now, return a placeholder response
    res.json({
      success: true,
      status: 'pending',
      paymentHash,
    });
  } catch (error) {
    console.error('Error checking invoice status:', error);
    
    res.status(500).json({ 
      error: 'Failed to check invoice status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

