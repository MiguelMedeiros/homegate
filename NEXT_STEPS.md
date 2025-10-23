# Next Steps - Testing Your New Backend

Follow these steps to test your new backend setup.

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Configure backend environment
cd back-end
./setup.sh
# Edit .env and add your PHOENIXD_TOKEN
# You can find it in: ../phoenixd/phoenix.conf (http-password)
cd ..

# 2. Build all services
make build

# 3. Start in development mode (with logs)
make dev
```

Wait for all services to start. You should see:
- ✅ phoenixd running on port 9740
- ✅ backend running on port 4000
- ✅ frontend running on port 3000

### Option 2: Local Development

```bash
# Terminal 1 - Backend
cd back-end
./setup.sh              # Setup .env file
# Edit .env and add your PHOENIXD_TOKEN
npm install
npm run dev

# Terminal 2 - Frontend
cd front-end
npm run dev
```

## ✅ Testing Checklist

### 1. Test Backend Health

```bash
curl http://localhost:4000/health
```

Expected response:
```json
{"status":"ok","service":"home-gate-backend"}
```

### 2. Test Backend Logs

In a new terminal:
```bash
make backend  # If using Docker
```

You should see:
```
🚀 Backend server running on port 4000
📍 Health check: http://localhost:4000/health
📍 Invoice API: http://localhost:4000/api/invoice
```

### 3. Test Frontend Connection

1. Open http://localhost:3000 in your browser
2. Navigate to the signup page
3. Try to create an invoice (the QR code page)
4. Check the browser console for any errors

### 4. Test Invoice Creation

You can test the invoice endpoint directly:

```bash
curl -X POST http://localhost:4000/api/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "amountSat": 1,
    "description": "Test invoice",
    "externalId": "test-'$(date +%s)'"
  }'
```

Expected response (example):
```json
{
  "success": true,
  "invoice": "lnbc...",
  "amountSat": 1,
  "paymentHash": "abc123...",
  "externalId": "test-1234567890",
  "description": "Test invoice"
}
```

## 🔍 Debugging

### Backend not starting?

Check logs:
```bash
make backend  # Docker
# or
cd back-end && npm run dev  # Local
```

Common issues:
- Port 4000 already in use? Change PORT in .env
- Missing dependencies? Run `npm install` in back-end directory
- phoenixd not accessible? Check PHOENIXD_HOST and PHOENIXD_TOKEN

### Frontend can't reach backend?

Check browser console for errors like:
- `Failed to fetch` - Backend not running
- `CORS error` - Backend CORS not configured (should be fine, it's enabled)
- `net::ERR_CONNECTION_REFUSED` - Wrong backend URL

Make sure NEXT_PUBLIC_BACKEND_URL is set correctly:
- Docker: `http://localhost:4000` (from browser)
- Local: `http://localhost:4000`

### Invoice creation failing?

1. Check phoenixd is running:
   ```bash
   curl http://localhost:9740/getinfo  # Might need auth
   ```

2. Check backend can reach phoenixd:
   ```bash
   make shell-be  # Open backend container shell
   ping phoenixd  # Should resolve in Docker
   ```

3. Verify PHOENIXD_TOKEN is set correctly

## 📝 Important Files Created

Here's what was created for you:

```
back-end/
├── src/
│   ├── index.ts                      # Main Express app
│   ├── routes/invoice.ts             # Route definitions
│   └── controllers/invoiceController.ts  # Business logic
├── package.json
├── tsconfig.json
├── Dockerfile
├── .env.example
└── README.md

front-end/
└── src/
    └── lib/config.ts                 # Backend API configuration

Root files:
├── docker-compose.yml                # Updated with backend service
├── Makefile                          # Updated with backend commands
├── SETUP.md                          # Setup instructions
├── MIGRATION_SUMMARY.md              # What changed
└── NEXT_STEPS.md                     # This file
```

## 🎯 Success Criteria

You'll know everything is working when:

1. ✅ Backend health check returns OK
2. ✅ Frontend loads without errors
3. ✅ You can navigate to signup/basic page
4. ✅ QR code is generated (means invoice was created)
5. ✅ No CORS errors in browser console
6. ✅ Backend logs show the invoice creation request

## 🔄 Making Changes

### Backend Changes

The backend uses `ts-node-dev` which auto-reloads on file changes:

1. Edit files in `back-end/src/`
2. Save
3. Backend automatically restarts
4. Check `make backend` logs to confirm

### Frontend Changes

Next.js also has hot reload:

1. Edit files in `front-end/src/`
2. Save
3. Browser automatically refreshes

## 📚 Need Help?

- Check `SETUP.md` for detailed setup instructions
- Check `MIGRATION_SUMMARY.md` to understand what changed
- Check `back-end/README.md` for API documentation
- Run `make help` to see all available commands

## 🎉 What's Next?

Once everything is working:

1. **Remove old API route** (optional cleanup):
   ```bash
   rm front-end/src/app/api/invoice/route.ts
   ```

2. **Add more endpoints** to backend as needed

3. **Add environment variables** to `.env` file (copy from `.env.example`)

4. **Test payment flow** end-to-end

5. **Deploy** when ready!

---

Have fun testing! 🚀

If you encounter any issues, check the logs:
```bash
make logs      # All services
make backend   # Backend only
make frontend  # Frontend only
```

