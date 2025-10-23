import { Router } from 'express';
import { createInvoice, getInvoiceStatus } from '../controllers/invoiceController';

const router = Router();

// POST /api/invoice - Create a new invoice
router.post('/', createInvoice);

// GET /api/invoice?paymentHash=xxx - Get invoice status
router.get('/', getInvoiceStatus);

export default router;

