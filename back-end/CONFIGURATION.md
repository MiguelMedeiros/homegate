# Backend Configuration

## Environment Variables Setup

The backend reads its configuration from a `.env` file in the `back-end/` directory.

### Quick Setup

```bash
cd back-end
cp .env.local .env
# Edit .env and add your PHOENIXD_TOKEN
```

### Required Variables

Create a file `back-end/.env` with the following content:

```bash
# Backend Server Configuration
PORT=4000

# phoenixd Configuration
# For Docker: use container name
PHOENIXD_HOST=http://phoenixd:9740
# For local development: use localhost
# PHOENIXD_HOST=http://localhost:9740

# phoenixd Authentication Token
# Get this from your phoenixd setup
PHOENIXD_TOKEN=your-phoenixd-token-here
```

### Getting Your phoenixd Token

The `PHOENIXD_TOKEN` is the authentication token for your phoenixd instance.

**To find it:**

1. Check your phoenixd data directory:
   ```bash
   cat phoenixd/phoenix.conf
   ```

2. Look for the `http-password` value - that's your token

3. Copy it to your `.env` file:
   ```bash
   PHOENIXD_TOKEN=your-actual-token-here
   ```

### Docker vs Local Development

**Docker Setup** (recommended):
```bash
PHOENIXD_HOST=http://phoenixd:9740
```
- Uses Docker container name for networking
- Backend container can reach phoenixd container

**Local Development**:
```bash
PHOENIXD_HOST=http://localhost:9740
```
- Uses localhost
- phoenixd must be running locally

### Verification

After creating your `.env` file:

1. **Check file exists:**
   ```bash
   ls -la back-end/.env
   ```

2. **Verify content:**
   ```bash
   cat back-end/.env
   ```

3. **Test backend:**
   ```bash
   cd back-end
   npm run dev
   ```

4. **Check health:**
   ```bash
   curl http://localhost:4000/health
   ```

### Troubleshooting

**"PHOENIXD_TOKEN not configured"**
- Make sure `.env` file exists in `back-end/` directory
- Verify `PHOENIXD_TOKEN` is set (not empty)
- Restart backend after changing `.env`

**"Cannot connect to phoenixd"**
- Verify `PHOENIXD_HOST` is correct
- Check phoenixd is running:
  ```bash
  curl http://localhost:9740/getinfo  # May need auth
  ```
- In Docker, check containers can communicate:
  ```bash
  docker exec backend ping phoenixd
  ```

### Security Note

⚠️ **Important**: The `.env` file is git-ignored by default. Never commit your actual tokens to version control!

```bash
# .gitignore already includes:
.env
*.log
```

### Example .env File

Here's a complete example (replace with your actual values):

```bash
# Backend Configuration
PORT=4000
PHOENIXD_HOST=http://phoenixd:9740
PHOENIXD_TOKEN=abc123def456ghi789jkl012mno345pqr678stu901vwx
```

### Docker Compose Integration

The `docker-compose.yml` is configured to use the `.env` file:

```yaml
backend:
  env_file:
    - ./back-end/.env
```

This means:
- Docker Compose will automatically load `back-end/.env`
- All variables will be available in the backend container
- No need to specify them individually in `docker-compose.yml`

### Next Steps

1. ✅ Create `back-end/.env` file
2. ✅ Add your `PHOENIXD_TOKEN`
3. ✅ Run `make build && make dev`
4. ✅ Test with `curl http://localhost:4000/health`
5. ✅ Create your first invoice!

---

Need help? Check [README.md](./README.md) or [NEXT_STEPS.md](../NEXT_STEPS.md)

